
import * as React from 'react'
import * as cn from 'classnames'
import { AnalysisProp } from '../../state/analysisStore'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { injectAndObserve } from '../../state/injectAndObserve'
import { getColorsFromAnalysis } from '../../helpers/analysisColors'
import { toRgb } from '../../pcss-functions'
import { logger } from '../../../shared/logger'

import { backgroundColors } from './shaderCanvas.pcss'
import { ShaderName, shaderNames } from './shaderName'
import { BuiltProgramWithUniforms } from './helpers/buildProgram'
import { COMMON_UNIFORMS, CommonMeta, CommonShaderBuilder } from './helpers/common'
import { requireShader } from './requireShader'

const shaderMap = new Map<ShaderName, CommonShaderBuilder>()
shaderNames.forEach(name => {
  shaderMap.set(name, requireShader(`./${name}/shader.ts`).default)
})

interface OwnProps {
  id?: string
  className?: string
  shaderName: ShaderName
}

type StateProps =
  & AnalysisProp
  & PatternsProp
  & RenderStateProp

function downloadFile (data: Blob, fileName: string) {
  // Create an invisible A element
  const a = document.createElement('a')
  a.style.display = 'none'
  document.body.appendChild(a)

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL(data)

  // Use download attribute to set set desired file name
  a.setAttribute('download', fileName)

  // Trigger the download by simulating click
  a.click()

  // Cleanup
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

export type ShaderCanvasProps = OwnProps & StateProps
export const ShaderCanvas = injectAndObserve<StateProps, OwnProps>(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class ShaderCanvas extends React.PureComponent<ShaderCanvasProps> {
    private _canvas?: HTMLCanvasElement
    private _gl?: WebGLRenderingContext
    private _renderId?: number
    private _startTime = Date.now()
    private _shader?: BuiltProgramWithUniforms<typeof COMMON_UNIFORMS, CommonMeta>
    private _takingScreenshot = false
    private _noop: any

    componentDidMount () {
      const { renderState } = this.props
      renderState.takeScreenshot = this._screenshot
      if (renderState.showColors) {
        this.start()
      }
    }

    componentDidUpdate (prevProps: ShaderCanvasProps) {
      const { shaderName, renderState } = this.props
      renderState.takeScreenshot = this._screenshot
      if (this._gl && shaderName !== prevProps.shaderName) {
        logger.info('Using shader:', shaderName)
        this._shader = shaderMap.get(shaderName)!(this._gl)
      }
      if (renderState.showColors) {
        this.start()
      } else {
        this.pause()
      }
    }

    private _screenshot = async () => {
      try {
        logger.info('taking screenshot')
        if (!this._canvas) {
          logger.warn('no canvas for screenshot!')
          return
        }
        this._takingScreenshot = true
        logger.info('creating image')
        const img = await this._getCanvasImage()
        const d = new Date()
        logger.info('using date', d)
        const filename = `SOVIS ${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.png`
        logger.info('using filename', filename)
        downloadFile(img, filename)
        logger.info('download done!')
      } finally {
        this._takingScreenshot = false
      }
    }

    private _getCanvasImage = () => (
      new Promise<Blob>((resolve, reject) => {
        if (!this._canvas) {
          return reject()
        }

        this._clearScene(true)
        this._drawScene()

        this._canvas.toBlob((b) => {
          if (b === null) {
            reject()
          } else {
            resolve(b)
          }
        }, 'image/png', 1)
      })
    )

    private _setCanvas = (canvas: HTMLCanvasElement) => {
      this._canvas = canvas
      if (!canvas) {
        this._shader = undefined
        this._startTime = 0
        this.pause()
        return
      }

      const gl = this._gl = canvas.getContext('webgl')!
      this._shader = shaderMap.get(this.props.shaderName)!(gl)
      this._startTime = Date.now()
    }

    private _renderLoop = () => {
      if (!this._canvas) {
        return
      }

      if (!this._takingScreenshot) {
        this._setUniforms()
        this._clearScene()
        this._drawScene()
      }

      this._renderId = requestAnimationFrame(this._renderLoop)
    }

    private _setUniforms = () => {
      if (!this._gl || !this._canvas || !this._shader) {
        return
      }
      const canvas = this._canvas

      const width = canvas.clientWidth | 0
      const height = canvas.clientHeight | 0

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      this._gl.useProgram(this._shader.program)

      this._shader.uniforms.u_time([(Date.now() - this._startTime) / 1000])
      this._shader.uniforms.u_dimensions([width, height])
      this._shader.uniforms.u_color1([0, 0, 0, 1])
      this._shader.uniforms.u_color2([0, 0, 0, 1])
      this._shader.uniforms.u_color3([0, 0, 0, 1])

      const { analysis, patterns, renderState } = this.props
      const { currentPattern, patternData } = patterns
      const pattern = patternData[currentPattern]

      if (!renderState.showColors || !pattern) {
        return
      }

      const colors = getColorsFromAnalysis(analysis, patterns)

      if (colors.length) {
        const colorArrays = colors.map(c => toRgb(c).toArray())
        this._shader.uniforms.u_color1(colorArrays[0])
        this._shader.uniforms.u_color2(colorArrays[1] || colorArrays[0])
        this._shader.uniforms.u_color3(colorArrays[2] || colorArrays[0])
      } else {
        this._shader.uniforms.u_color1([0, 0, 0, 1])
        this._shader.uniforms.u_color2([0, 0, 0, 1])
        this._shader.uniforms.u_color3([0, 0, 0, 1])
      }

      // this._shader.uniforms.u_color1([1, 0, 0, 1])
      // this._shader.uniforms.u_color2([0, 1, 0, 1])
      // this._shader.uniforms.u_color3([0, 0, 1, 1])
    }

    private _clearScene = (black = false) => {
      if (!this._gl || !this._shader) {
        return
      }

      const gl = this._gl

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

      // Clear the canvas
      if (black) {
        gl.clearColor(27 / 255, 33 / 255, 40 / 255, 1)
      } else {
        gl.clearColor(0, 0, 0, 0)
      }
      gl.clear(gl.COLOR_BUFFER_BIT)
    }

    private _drawScene = () => {
      if (!this._gl || !this._shader) {
        return
      }

      const gl = this._gl

      // Render the scene
      this._shader.meta.render(gl, this._shader.program)
    }

    start = () => {
      if (!this._renderId) {
        this._renderLoop()
      }
    }

    pause = () => {
      if (this._renderId) {
        cancelAnimationFrame(this._renderId)
        this._clearScene()
      }
      delete this._renderId
    }

    render () {
      const { id, className, renderState } = this.props

      // We have to reference renderState.showColors during render,
      // otherwise the component won't be re-rendered when the value changes
      this._noop = renderState.showColors

      return (
        <canvas
          id={id}
          className={cn(backgroundColors, className)}
          ref={this._setCanvas}
        />
      )
    }
  },
)

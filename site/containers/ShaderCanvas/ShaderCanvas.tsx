
import * as React from 'react'
import * as cn from 'classnames'
import { AnalysisProp } from '../../state/analysisStore'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { injectAndObserve } from '../../state/injectAndObserve'
import { getColorsFromAnalysis } from '../../helpers/analysisColors'
import { toRgb } from '../../pcss-functions'

import { backgroundColors } from './shaderCanvas.pcss'
import { ShaderName, shaderNames } from './shaderName'
import { BuiltProgramWithUniforms } from './helpers/buildProgram'
import { COMMON_UNIFORMS, CommonMeta, CommonShaderBuilder } from './helpers/common'
import { logger } from '../../../shared/logger'

const requireShader = require.context('./shaders', true, /shader\.ts$/)

const shaderMap = new Map<ShaderName, CommonShaderBuilder>()
shaderNames.forEach(name => {
  shaderMap.set(name, requireShader(`./${name}/shader.ts`).default)
})

interface OwnProps {
  id?: string
  className?: string
  shaderName?: ShaderName
}

type StateProps =
  & AnalysisProp
  & PatternsProp
  & RenderStateProp

export type ShaderCanvasProps = OwnProps & StateProps

export const DEFAULT_SHADER: ShaderName = 'lights'
export const ShaderCanvas = injectAndObserve<StateProps, OwnProps>(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class ShaderCanvas extends React.PureComponent<ShaderCanvasProps> {
    private _canvas?: HTMLCanvasElement
    private _gl?: WebGLRenderingContext
    private _renderId?: number
    private _startTime = Date.now()
    private _shader?: BuiltProgramWithUniforms<typeof COMMON_UNIFORMS, CommonMeta>

    componentDidUpdate (prevProps: ShaderCanvasProps) {
      const { shaderName = DEFAULT_SHADER } = this.props
      if (this._gl && shaderName !== prevProps.shaderName) {
        logger.info('Using shader:', shaderName)
        this._shader = shaderMap.get(shaderName)!(this._gl)
      }
    }

    private _setCanvas = (canvas: HTMLCanvasElement) => {
      this._canvas = canvas
      if (!canvas) {
        this._shader = undefined
        this._startTime = 0
        this.pause()
        return
      }

      const gl = this._gl = canvas.getContext('webgl')!
      this._shader = shaderMap.get(this.props.shaderName || DEFAULT_SHADER)!(gl)
      this._startTime = Date.now()
      this.start()
    }

    private _renderLoop = () => {
      if (!this._canvas) {
        return
      }

      this._setUniforms()
      this._drawScene()

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

    private _drawScene = () => {
      if (!this._gl || !this._shader) {
        return
      }

      const gl = this._gl

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      if (!this.props.renderState.showColors) {
        return
      }

      // Render the scene
      this._shader.meta.render(gl, this._shader.program)
    }

    start = () => {
      this._renderLoop()
    }

    pause = () => {
      if (this._renderId) {
        cancelAnimationFrame(this._renderId)
      }
      delete this._renderId
    }

    render () {
      const { id, className } = this.props
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

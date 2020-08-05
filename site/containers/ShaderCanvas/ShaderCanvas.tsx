
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { logger } from '../../../shared/logger'
import { getColorsFromAnalysis } from '../../helpers/analysisColors'
import { useCanvasContext } from '../../hooks/useCanvasContext'
import { HSVa, toRgb } from '../../pcss-functions'
import { AnalysisProp } from '../../state/analysisStore'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { useStores } from '../../state/useStores'

import { BuiltProgramWithUniforms } from './helpers/buildProgram'
import { CommonMeta, CommonShaderBuilder, COMMON_UNIFORMS } from './helpers/common'
import { requireShader } from './requireShader'
import { backgroundColors } from './shaderCanvas.pcss'
import { ShaderName, shaderNames } from './shaderName'

const shaderMap = new Map<ShaderName, CommonShaderBuilder>()
shaderNames.forEach(name => {
  shaderMap.set(name, requireShader(`./${name}/shader.ts`).default)
})

export interface OwnProps {
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

function getCanvasImage (canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    if (!canvas) {
      return reject()
    }

    canvas.toBlob((b) => {
      if (b === null) {
        reject()
      } else {
        resolve(b)
      }
    }, 'image/png', 1)
  })
}

interface UniformsOpts {
  gl: WebGLRenderingContext | null
  canvas: HTMLCanvasElement | null
  shader: BuiltProgramWithUniforms<typeof COMMON_UNIFORMS, CommonMeta> | null
  startTime: number
  colors: HSVa[]
}
const GL_BLACK = Object.freeze([0, 0, 0, 1]) as [number, number, number, number]
const setUniforms = ({ gl, canvas, shader, startTime, colors }: UniformsOpts) => {
  if (!gl || !canvas || !shader) {
    return
  }

  const width = canvas.clientWidth | 0
  const height = canvas.clientHeight | 0

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  gl.useProgram(shader.program)

  shader.uniforms.u_time([(Date.now() - startTime) / 1000])
  shader.uniforms.u_dimensions([width, height])
  shader.uniforms.u_color1(GL_BLACK)
  shader.uniforms.u_color2(GL_BLACK)
  shader.uniforms.u_color3(GL_BLACK)
  shader.uniforms.u_color4(GL_BLACK)
  shader.uniforms.u_color5(GL_BLACK)

  if (colors.length) {
    const colorArrays = colors.map(c => toRgb(c).toArray())
    shader.uniforms.u_color1(colorArrays[0])
    shader.uniforms.u_color2(colorArrays[1] || colorArrays[0])
    shader.uniforms.u_color3(colorArrays[2] || colorArrays[0])
    shader.uniforms.u_color4(colorArrays[3] || colorArrays[0])
    shader.uniforms.u_color5(colorArrays[4] || colorArrays[0])
  }
}

const clearScene = (gl: WebGLRenderingContext | null, black = false) => {
  if (!gl) {
    return
  }

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

const drawScene = (gl: WebGLRenderingContext | null, shader: BuiltProgramWithUniforms<typeof COMMON_UNIFORMS, CommonMeta> | null) => {
  if (!gl || !shader) {
    return
  }

  // Render the scene
  shader.meta.render(gl, shader.program)
}

export function ShaderCanvas ({ id, className, shaderName }: OwnProps) {
  const { analysis, patterns, renderState } = useStores()
  const [canvasRef, gl] = useCanvasContext('webgl')
  const renderId = React.useRef<number>()
  const startTime = React.useRef<number>()
  const takingScreenshot = React.useRef<boolean>()
  const [, dummyState] = React.useState(0)

  const forceRender = React.useCallback(() => {
    dummyState(Math.random())
  }, [dummyState])

  if (!startTime.current) {
    startTime.current = Date.now()
  }

  const shader = React.useMemo(() => {
    const shaderBuilder = shaderMap.get(shaderName)
    if (!gl || !shaderBuilder) {
      return null
    }

    return shaderBuilder(gl)
  }, [shaderName, gl])

  const takeScreenshot = React.useCallback(async () => {
    try {
      logger.info('taking screenshot')
      if (!canvasRef.current) {
        logger.warn('no canvas for screenshot!')
        return
      }
      takingScreenshot.current = true
      logger.info('creating image')

      clearScene(gl, true)
      drawScene(gl, shader)
      const img = await getCanvasImage(canvasRef.current)
      const d = new Date()
      logger.info('using date', d)
      const filename = `SOVIS ${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.png`
      logger.info('using filename', filename)
      downloadFile(img, filename)
      logger.info('download done!')
    } finally {
      takingScreenshot.current = false
    }
  }, [gl, canvasRef.current, shader, takingScreenshot])

  React.useEffect(() => {
    renderState.takeScreenshot = takeScreenshot
  }, [renderState, takeScreenshot])

  const renderLoop = React.useCallback(() => {
    if (!canvasRef.current || !gl) {
      renderId.current = requestAnimationFrame(renderLoop)
      return
    }

    if (!takingScreenshot.current) {
      setUniforms({ gl, canvas: canvasRef.current, shader, startTime: startTime.current!, colors: getColorsFromAnalysis(analysis, patterns) })
      clearScene(gl)
      drawScene(gl, shader)
    }

    renderId.current = requestAnimationFrame(renderLoop)
  }, [canvasRef.current, gl, shader, startTime, analysis, patterns])

  return useObserver(() => {
    React.useEffect(() => {
      if (!gl) {
        forceRender()
        return
      }
      if (renderState.showColors && !renderId.current) {
        renderLoop()
      } else if (!renderState.showColors && renderId.current) {
        cancelAnimationFrame(renderId.current)
        renderId.current = undefined
        clearScene(gl)
      }
    }, [renderState.showColors, renderId, gl])

    return (
      <canvas
        id={id}
        className={cn(backgroundColors, className)}
        ref={canvasRef}
      />
    )
  })
}

import { renderStateStore } from '../../../state/renderStateStore'
import { shaderInfo, ShaderName } from '../shaderName'

import { BuiltProgramWithUniforms } from './buildProgram'
import { UniformMap, UniformSetter } from './buildUniformMap'

export interface CommonMeta {
  render: (gl: WebGLRenderingContext, program: WebGLProgram) => void
  sliders?: {
    [name: string]: {
      label: string
      min: number
      max: number
    }
  }
}

const vertexSize = 2
const programMap = new WeakMap<WebGLProgram, WebGLBuffer>()
const vertexArray = new Float32Array([
  // TRIANGLE 1: top right
  0, 1, 1, 1, 1, 0,
  // TRIANGLE 2: bottom left
  0, 1, 1, 0, 0, 0,
])

export function baseRender (gl: WebGLRenderingContext, program: WebGLProgram) {
  gl.useProgram(program)

  if (!programMap.has(program)) {
    programMap.set(program, gl.createBuffer()!)
  }

  const vertexBuffer = programMap.get(program)!
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW)

  const vertexPosition = gl.getAttribLocation(program, 'a_vertexPosition')
  gl.enableVertexAttribArray(vertexPosition)
  gl.vertexAttribPointer(vertexPosition, vertexSize, gl.FLOAT, false, 0, 0)

  gl.drawArrays(gl.TRIANGLES, 0, vertexArray.length / vertexSize)
}

export const COMMON_META: CommonMeta = {
  render: baseRender,
}

export function typesafeUniformMap<T extends UniformMap> (map: T) {
  return map
}

export const COMMON_UNIFORMS = typesafeUniformMap({
  u_time: 'float',
  u_dimensions: 'vec2',
  u_color1: 'vec4',
  u_color2: 'vec4',
  u_color3: 'vec4',
  u_color4: 'vec4',
  u_color5: 'vec4',
})

export type CommonUniforms = typeof COMMON_UNIFORMS

export interface CommonShaderBuilder<
  Uniforms extends CommonUniforms = CommonUniforms,
  Meta extends CommonMeta = CommonMeta,
> {
  (gl: WebGLRenderingContext): BuiltProgramWithUniforms<Uniforms, Meta>
}

export const defaultShaderRenderer = (name: ShaderName, built: BuiltProgramWithUniforms<CommonUniforms, CommonMeta>) => {
  const info = shaderInfo[name]
  const sliders = info.sliders
  if (!sliders) {
    return baseRender
  }

  return (gl: WebGLRenderingContext, program: WebGLProgram) => {
    gl.useProgram(program)

    Object.keys(sliders).forEach((slider) => {
      const { defaultValue, mapper } = sliders[slider]
      const { [slider]: sliderValue = defaultValue } = renderStateStore.shaderSliders
      const setUniform = built.uniforms[slider as keyof CommonUniforms] as UniformSetter<[number]>
      const value = mapper ? mapper(sliderValue) : sliderValue
      // logger.info(`Setting uniform '${slider}' to ${currentValue.toFixed(2)}`)
      setUniform([value])
    })

    baseRender(gl, program)
  }
}

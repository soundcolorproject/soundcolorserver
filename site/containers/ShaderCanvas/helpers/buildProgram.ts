
import { UniformMap, BuiltUniformMap, buildUniformMap } from './buildUniformMap'
import { BuildShaderOpts, buildShader } from './buildShader'
import { logger } from '../../../../shared/logger'

interface BuildProgramOpts<T extends UniformMap, Meta> {
  gl: WebGLRenderingContext
  shaders: BuildShaderOpts[]
  meta?: Meta
  uniforms?: T
}

export type BuiltProgram<T extends UniformMap, Meta> = T extends object ? {
  gl: WebGLRenderingContext
  program: WebGLProgram
  shaders: WebGLShader[]
  meta: Meta
} : never

export type BuiltProgramWithUniforms<T extends UniformMap, Meta> = {
  gl: WebGLRenderingContext
  program: WebGLProgram
  shaders: WebGLShader[]
  meta: Meta
  uniforms: BuiltUniformMap<T>
}

export function buildProgram<T extends UniformMap, Meta> (opts: BuildProgramOpts<T, Meta> & { uniforms?: undefined }): BuiltProgram<T, Meta>
export function buildProgram<T extends UniformMap, Meta> (opts: BuildProgramOpts<T, Meta> & { uniforms: T }): BuiltProgramWithUniforms<T, Meta>
export function buildProgram<T extends UniformMap, Meta> (opts: BuildProgramOpts<T, Meta>): BuiltProgramWithUniforms<T, Meta> {
  const { gl, shaders: shaderOpts, uniforms: uniformOpts, meta } = opts
  const program = gl.createProgram()!
  const shaders = shaderOpts.map(buildShader(gl, program))

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    logger.error('Error linking shader program:', gl.getProgramInfoLog(program))
  }

  const uniforms = buildUniformMap(gl, program, uniformOpts)

  return {
    gl,
    program,
    shaders,
    meta: { ...meta } as Meta,
    uniforms,
  }
}

import { logger } from '../../../../shared/logger'

export interface BuildShaderOpts {
  type: 'VERTEX_SHADER' | 'FRAGMENT_SHADER'
  source: string
}

export const buildShader = (gl: WebGLRenderingContext, program: WebGLProgram) => ({ type, source }: BuildShaderOpts): WebGLShader => {
  const shader = gl.createShader(gl[type])!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  gl.attachShader(program, shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    logger.error('Error compiling shader:', gl.getShaderInfoLog(shader))
  }

  return shader
}

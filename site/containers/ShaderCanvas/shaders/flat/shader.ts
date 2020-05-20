
import { buildProgram } from '../../helpers/buildProgram'
import { COMMON_UNIFORMS, CommonMeta, CommonShaderBuilder, COMMON_META, defaultShaderRenderer } from '../../helpers/common'
// import { logger } from '../../../../../shared/logger'

import fragSrc from './flat.frag'
import vertSrc from './flat.vert'

const buildSimpleShader: CommonShaderBuilder = function buildSimpleShader (gl: WebGLRenderingContext) {
  const meta: CommonMeta = {
    ...COMMON_META,
  }

  const built = buildProgram({
    gl,
    shaders: [
      {
        type: 'VERTEX_SHADER',
        source: vertSrc,
      },
      {
        type: 'FRAGMENT_SHADER',
        source: fragSrc,
      },
    ],
    uniforms: {
      ...COMMON_UNIFORMS,
      u_noise: 'float',
    },
    meta,
  })

  built.meta.render = defaultShaderRenderer('flat', built)

  return built
}

export default buildSimpleShader

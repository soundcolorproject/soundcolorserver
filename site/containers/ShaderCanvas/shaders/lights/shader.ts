
import { buildProgram, BuiltProgramWithUniforms } from '../../helpers/buildProgram'
import {
  COMMON_UNIFORMS,
  typesafeUniformMap,
  CommonShaderBuilder,
  COMMON_META,
  defaultShaderRenderer,
} from '../../helpers/common'
// import { logger } from '../../../../../shared/logger'

import fragSrc from './lights.frag'
import vertSrc from './lights.vert'

const uniforms = typesafeUniformMap({
  ...COMMON_UNIFORMS,
  u_diffusion: 'float',
})

type Uniforms = typeof uniforms
type Builder = CommonShaderBuilder<Uniforms>

const buildSimpleShader: Builder = function buildSimpleShader (gl: WebGLRenderingContext) {
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
      u_lightRotation: 'float',
      u_diffusion: 'float',
      u_noise: 'float',
    },
    meta: {
      ...COMMON_META,
    },
  })

  built.meta.render = defaultShaderRenderer('lights', built)

  return built
}

export default buildSimpleShader

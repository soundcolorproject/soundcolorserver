
import { buildProgram, BuiltProgramWithUniforms } from '../../helpers/buildProgram'
import {
  CommonShaderBuilder,
  COMMON_META,
  COMMON_UNIFORMS,
  defaultShaderRenderer,
  typesafeUniformMap,
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
      u_lightCount: 'int',
    },
    meta: {
      ...COMMON_META,
    },
  })

  built.meta.render = defaultShaderRenderer('lights', built)

  return built
}

export default buildSimpleShader

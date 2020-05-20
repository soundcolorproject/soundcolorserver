
export type ShaderName =
  | 'flat'
  | 'lights'

export const shaderNames: ShaderName[] = [
  'flat',
  'lights',
]

interface ShaderInfo {
  label: string
  description: string
  sliders?: {
    [name: string]: {
      label: string
      description: string
      defaultValue: number
      min: number
      max: number
      step?: number
      mapper?: (val: number) => number
    }
  }
}

let previousTime = Date.now()
let previousValue = 0
function multiplyTime (speed: number) {
  const newTime = Date.now()
  previousValue += (newTime - previousTime) * speed
  previousTime = newTime
  return previousValue / 1000
}

export const shaderInfo: { [name in ShaderName]: ShaderInfo } = {
  flat: {
    label: 'Flat Color',
    description: '',
    sliders: {
      u_noise: {
        label: 'Color Noise',
        description: '',
        defaultValue: 1,
        min: 0,
        max: 2,
      },
    },
  },
  lights: {
    label: 'Circulating Lights',
    description: '',
    sliders: {
      u_lightRotation: {
        label: 'Light Rotation Speed',
        description: '',
        defaultValue: 1 / 3,
        min: 0,
        max: 3,
        mapper: multiplyTime,
      },
      u_diffusion: {
        label: 'Light Distance',
        description: '',
        defaultValue: 1,
        min: 0,
        max: 3,
      },
      u_noise: {
        label: 'Color Noise',
        description: '',
        defaultValue: 0.1,
        min: 0,
        max: 1,
      },
    },
  },
}

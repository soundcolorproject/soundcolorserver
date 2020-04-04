
import { defaultColors } from './constants'

export function getDefault (colorName: keyof typeof defaultColors) {
  return defaultColors[colorName]
}

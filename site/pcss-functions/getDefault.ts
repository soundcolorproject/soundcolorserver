
import { defaultColors } from './constants'

export function getDefault (colorName: keyof typeof defaultColors) {
  if (!defaultColors[colorName]) {
    throw new Error(`No default color exists for key '${colorName}'`)
  }
  return defaultColors[colorName]
}

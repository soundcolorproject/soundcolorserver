
import { printDigits } from '../helpers/numbers'

import { toRgb } from './toRgb'
import { Color } from './types'

export function printRgb (color: Color): string {
  const srgb = toRgb(color)
  const R = printDigits(srgb.r * 255, 1)
  const G = printDigits(srgb.g * 255, 1)
  const B = printDigits(srgb.b * 255, 1)

  return `${R}, ${G}, ${B}`
}

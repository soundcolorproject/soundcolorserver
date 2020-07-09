
import { toHsl, HSLa } from './toHsl'
import { RGBa } from './toRgb'

import { Color } from './types'

export function darken (color: Color, amount: string | number): Color {
  if (typeof color === 'string' || color.type !== 'HSLa') {
    color = toHsl(color).clone()
  }

  if (typeof amount === 'string') {
    amount = parseFloat(amount)
  }

  if (amount >= 1) {
    return new RGBa(0, 0, 0, color.a)
  }

  if (amount <= 0) {
    return color
  }

  color.l = color.l * (1 - amount)

  return color
}

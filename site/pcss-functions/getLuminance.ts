
import { HSVa } from './toHsv'
import { toSRgb } from './toSRgb'
import { Color } from './types'

export function getLuminance (color: Color) {
  let [r, g, b] = toSRgb(color).map(c => (
    c > 0.03928
      ? ((c + 0.055) / 1.055) ** 2.4
      : c / 12.92
  ))

  return (
    0.2126 * r +
    0.7152 * g +
    0.0722 * b
  )
}

const cutoff = 0.03928 / 12.92
export function greyScale (color: Color) {
  let [r, g, b] = toSRgb(color).map(c => (
    c > 0.03928
      ? ((c + 0.055) / 1.055) ** 2.4
      : c / 12.92
  ))

  const lum = (
    0.4252 * r +
    0.7152 * g +
    0.2888 * b
  )

  const c = lum > cutoff
    ? lum ** (1 / 2.4) * 1.055 - 0.055
    : lum * 12.92

  return new HSVa(0, 0, c)
}

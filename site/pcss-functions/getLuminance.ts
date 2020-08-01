
import { toRgb } from './toRgb'
import { SRGBa } from './toSRgb'
import { Color } from './types'

export function getLuminance (color: Color) {
  color = toRgb(new SRGBa(...toRgb(color).toArray()))

  return (
    0.2126 * color.r +
    0.7152 * color.g +
    0.0722 * color.b
  )
}

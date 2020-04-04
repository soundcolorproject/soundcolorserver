
import { toRgb, Rgba } from './toRgb'
import { toSRgb } from './toSRgb'

import { Color } from './types'

export function getLuminance (color: Color) {
  if (!(color instanceof Rgba)) {
    color = toRgb(toSRgb(color))
  }

  return (
    0.2126 * color.r +
    0.7152 * color.g +
    0.0722 * color.b
  )
}

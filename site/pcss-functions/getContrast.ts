
import { colorConversion } from './constants'
import { getLuminance } from './getLuminance'

import { Color } from './types'

export function getContrast (c1: Color, c2: Color) {
  const l1 = getLuminance(c1)
  const l2 = getLuminance(c2)

  return (Math.max(l1, l2) + colorConversion.lumContrastConstant)
       / (Math.min(l1, l2) + colorConversion.lumContrastConstant)
}

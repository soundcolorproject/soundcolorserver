
import { colorConversion, defaultColors } from './constants'
import { getLuminance } from './getLuminance'
import { calculateCentralLuminance } from './calculateCentralLuminance'

import { Color } from './types'

const VAR_BLACK = 'var(--black)'
const VAR_WHITE = 'var(--white)'
const TRUE_BLACK = '#000'
const TRUE_WHITE = '#fff'

const VAR_CENTRAL_LUM = calculateCentralLuminance(
  defaultColors.white,
  defaultColors.black,
)

export function getContrastingColor (color: Color, useTrue = false) {
  const lum = getLuminance(color)
  if (useTrue) {
    if (lum < colorConversion.centralLum) {
      return TRUE_WHITE
    } else {
      return TRUE_BLACK
    }
  } else {
    if (lum < VAR_CENTRAL_LUM) {
      return VAR_WHITE
    } else {
      return VAR_BLACK
    }
  }
}

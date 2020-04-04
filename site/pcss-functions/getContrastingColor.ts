
import { colorConversion } from './constants'
import { getLuminance } from './getLuminance'

import { Color } from './types'

const VAR_BLACK = 'var(--black)'
const VAR_WHITE = 'var(--white)'
const TRUE_BLACK = '#000'
const TRUE_WHITE = '#fff'

export function getContrastingColor (color: Color, useTrue = true) {
  const lum = getLuminance(color)
  if (lum < colorConversion.centralLum) {
    return useTrue ? TRUE_WHITE : VAR_WHITE
  } else {
    return useTrue ? TRUE_BLACK : VAR_BLACK
  }
}


import { wcag, colorConversion } from './constants'
import { getLuminance } from './getLuminance'
import { getContrast } from './getContrast'
import { getContrastingColor } from './getContrastingColor'
import { toHsl } from './toHsl'

import { Color } from './types'
import { logger } from '../../shared/logger'

export function makeCompliant (variableColor: Color, staticColor: Color, useAAA = USE_AAA) {
  const { contrastRatio, minLumOnBlack, maxLumOnWhite } = useAAA ? wcag.aaa : wcag.aa
  if (getContrast(variableColor, staticColor) >= contrastRatio) {
    return variableColor
  }

  variableColor = toHsl(variableColor)
  const staticLum = getLuminance(staticColor)

  if (minLumOnBlack > staticLum && staticLum > maxLumOnWhite) {
    logger.error(`The static color ${staticColor} is strictly non-compliant; will return black or white appropriately`)
    return getContrastingColor(staticColor)

  } else if (staticLum < colorConversion.centralLum) {
    while (getContrast(variableColor, staticColor) < contrastRatio) {
      variableColor.l = Math.min(variableColor.l + 0.01, 1)
    }

  } else {
    while (getContrast(variableColor, staticColor) < contrastRatio) {
      variableColor.l = Math.max(variableColor.l - 0.01, 0)
    }
  }

  return variableColor
}

export let USE_AAA = true

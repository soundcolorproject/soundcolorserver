import { colorConversion } from './constants'
import { getLuminance } from './getLuminance'
import { Color } from './types'

export function calculateCentralLuminance (white: Color, black: Color) {
  const whiteLum = getLuminance(white)
  const blackLum = getLuminance(black)
  const c = colorConversion.lumContrastConstant

  return Math.sqrt((whiteLum + c) * (blackLum + c)) - c
}

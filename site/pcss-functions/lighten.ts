
import { toHsv } from './toHsv'
import { toHsl } from './toHsl'
import { RGBa, toRgb } from './toRgb'
import { SRGBa } from './toSRgb'

import { Color } from './types'

function toStandard (color: Color) {
  color = toSRgb(color)
  color = new RGBa(color.r, color.g, color.b, color.a)
  return color
}

function fromStandard (color: Color) {
  color = toRgb(color)
  color = toRgb(new SRGBa(color.r, color.g, color.b, color.a))
  return color
}

function lightenHsv (color: Color, amount: number, srgbMode: boolean) {
  if (typeof color === 'string' || color.type !== 'HSVa') {
    color = toHsv(color).clone()
  }

  color.v = 1 - (1 - color.v) * (1 - amount)

  if (srgbMode) {
    color = toStandard(color)
  }

  return color
}

function lightenHsl (color: Color, amount: number, srgbMode: boolean) {
  if (typeof color === 'string' || color.type !== 'HSLa') {
    color = toHsl(color).clone()
  }

  color.l = 1 - (1 - color.l) * (1 - amount)

  if (srgbMode) {
    color = toStandard(color)
  }

  return color
}

export type LightenMode = 'HSV' | 'HSL' | 'sHSV' | 'sHSL'
export function lighten (color: Color, amount: string | number, mode: LightenMode = 'HSV'): Color {
  if (typeof amount === 'string') {
    amount = parseFloat(amount)
  }

  if (amount >= 1) {
    if (typeof color === 'string') {
      color = toHsv(color)
    }
    return new RGBa(1, 1, 1, color.a)
  }

  if (amount <= 0) {
    return color
  }

  const srgbMode = mode[0] === 's'
  if (srgbMode) {
    color = fromStandard(color)
  }

  switch (mode) {
    case 'HSV':
    case 'sHSV':
      return lightenHsv(color, amount, srgbMode)
    case 'HSL':
    case 'sHSL':
      return lightenHsl(color, amount, srgbMode)
  }
}

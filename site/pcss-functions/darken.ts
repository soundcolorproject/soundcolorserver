
import { toHsl } from './toHsl'
import { toHsv } from './toHsv'
import { RGBa, toRgb } from './toRgb'
import { SRGBa, toSRgb } from './toSRgb'

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

function darkenHsv (color: Color, amount: number, srgbMode: boolean) {
  if (typeof color === 'string' || color.type !== 'HSVa') {
    color = toHsv(color).clone()
  }

  color.v = color.v * (1 - amount)

  if (srgbMode) {
    color = toStandard(color)
  }

  return color
}

function darkenHsl (color: Color, amount: number, srgbMode: boolean) {
  if (typeof color === 'string' || color.type !== 'HSLa') {
    color = toHsl(color).clone()
  }

  color.l = color.l * (1 - amount)

  if (srgbMode) {
    color = toStandard(color)
  }

  return color
}

export type DarkenMode = 'HSV' | 'HSL' | 'sHSV' | 'sHSL'
export function darken (color: Color, amount: string | number, mode: DarkenMode = 'sHSL'): Color {
  if (typeof amount === 'string') {
    amount = parseFloat(amount)
  }

  if (amount >= 1) {
    if (typeof color === 'string') {
      color = toHsv(color)
    }
    return new RGBa(0, 0, 0, color.a)
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
      return darkenHsv(color, amount, srgbMode)
    case 'HSL':
    case 'sHSL':
      return darkenHsl(color, amount, srgbMode)
  }
}

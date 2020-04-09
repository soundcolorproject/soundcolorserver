
import { printDigits } from '../helpers/numbers'
import { colorConversion } from './constants'
import { parseColor } from './parseColor'

import { toRgb, RGBa } from './toRgb'
import { HSLa } from './toHsl'

import { Color } from './types'

export function toSRgb (color: Color): SRGBa {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color.type === 'SRGBa') {
    return color
  }

  return SRGBa.fromRgb(toRgb(color))
}

function toHex (num: number) {
  num = Math.round(num)
  let str = Math.max(0, Math.min(num, 255)).toString(16)
  if (str.length === 1) {
    return `0${str}`
  } else {
    return str
  }
}

export class SRGBa {
  readonly type = 'SRGBa'

  constructor (
    public r: number,
    public g: number,
    public b: number,
    public a = 1,
  ) {}

  map (mapper: (n: number) => number) {
    return [this.r, this.g, this.b].map(mapper).concat(this.a) as [number, number, number, number]
  }

  toString () {
    if (this.a !== 1) {
      const R = printDigits(this.r * 255, 2)
      const G = printDigits(this.g * 255, 2)
      const B = printDigits(this.b * 255, 2)
      const a = printDigits(this.a, 4)
      return `rgba(${R}, ${G}, ${B}, ${a})`
    } else {
      const R = toHex(this.r * 255)
      const G = toHex(this.g * 255)
      const B = toHex(this.b * 255)
      return `#${R}${G}${B}`
    }
  }

  valueOf () {
    return [this.r, this.g, this.b, this.a]
  }

  static fromRgb (orig: RGBa) {
    if (!(orig instanceof RGBa)) {
      throw new Error('input to fromRgb must be of type Rgba')
    }

    return new SRGBa(...orig.map(c => {
      if (c <= colorConversion.sRgbCutoff / colorConversion.lowRatio) {
        return c * colorConversion.lowRatio
      }

      return Math.pow(c * (1 + colorConversion.fix), 1 / colorConversion.power) - colorConversion.fix
    }))
  }

  static fromHsl (orig: HSLa) {
    if (!(orig instanceof HSLa)) {
      throw new Error('input to fromHsl must be of type HSLa')
    }

    return SRGBa.fromRgb(toRgb(orig))
  }
}

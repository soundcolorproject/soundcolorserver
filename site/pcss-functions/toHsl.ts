
import { printDigits } from '../helpers/numbers'
import { parseColor } from './parseColor'

import { toRgb, RGBa } from './toRgb'

import { Color } from './types'

export function toHsl (color: Color): HSLa {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color instanceof HSLa) {
    return color
  }

  return HSLa.fromRgb(toRgb(color))
}

export class HSLa {
  constructor (
    public h: number,
    public s: number,
    public l: number,
    public a = 1,
  ) {}

  toHslString () {
    const H = printDigits(this.h, 2)
    const S = printDigits(this.s * 100, 2)
    const L = printDigits(this.l * 100, 2)
    if (this.a !== 1) {
      const a = printDigits(this.a, 3)
      return `hsla(${H},${S}%,${L}%,${a})`
    } else {
      return `hsl(${H},${S}%,${L}%)`
    }
  }

  toString (useHsl = USE_HSL) {
    if (useHsl) {
      return this.toHslString()
    } else {
      return toRgb(this).toString()
    }
  }

  valueOf () {
    return [this.h,this.s,this.l,this.a]
  }

  static fromRgb (orig: RGBa) {
    if (!(orig instanceof RGBa)) {
      throw new Error('input to fromRgb must be of type Rgba')
    }

    const R = orig.r
    const G = orig.g
    const B = orig.b

    const max = Math.max(R, Math.max(G, B))
    const min = Math.min(R, Math.min(G, B))
    const delta = max - min

    const L = (max + min) / 2

    let S
    if (max === min) {
      S = 0
    } else if (L < 0.5) {
      S = delta / (max + min)
    } else {
      S = delta / (2 - max - min)
    }

    let H
    if (delta === 0) {
      H = 0
    } else if (R === max) {
      H = (G - B) / delta
      H = H < 0 ? H + 6 : H
    } else if (G === max) {
      H = 2 + (B - R) / delta
    } else {
      H = 4 + (R - G) / delta
    }

    return new HSLa(H * 60, S, L, orig.a)
  }
}

export let USE_HSL = false

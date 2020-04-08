
import { printDigits } from '../helpers/numbers'
import { parseColor } from './parseColor'

import { toRgb, RGBa } from './toRgb'

import { Color } from './types'

export function toHsv (color: Color): HSVa {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color instanceof HSVa) {
    return color
  }

  return HSVa.fromRgb(toRgb(color))
}

export class HSVa {
  constructor (
    public h: number,
    public s: number,
    public v: number,
    public a = 1,
  ) {}

  toString () {
    return toRgb(this).toString()
  }

  valueOf () {
    return [this.h,this.s,this.v,this.a]
  }

  clone () {
    return new HSVa(this.h, this.s, this.v, this.a)
  }

  static fromRgb (orig: RGBa) {
    if (!(orig instanceof RGBa)) {
      throw new Error('input to fromRgb must be of type Rgba')
    }

    const R = orig.r
    const G = orig.g
    const B = orig.b

    const max = Math.max(R, G, B)
    const min = Math.min(R, G, B)
    const delta = max - min

    const V = max

    let S
    if (max === 0) {
      S = 0
    } else {
      S = delta / max
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

    return new HSVa(H * 60, S, V, orig.a)
  }
}

export let USE_HSL = false

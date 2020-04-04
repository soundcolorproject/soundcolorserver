
import { colorConversion } from './constants'
import { parseColor } from './parseColor'

import { HSLa } from './toHsl'
import { toSRgb, Srgba } from './toSRgb'

import { Color } from './types'

export function toRgb (color: Color): Rgba {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color instanceof Rgba) {
    return color
  }

  if (color instanceof HSLa) {
    return Rgba.fromHSL(color)
  }

  return Rgba.fromSRgb(toSRgb(color))
}

export class Rgba {
  constructor (
    public r: number,
    public g: number,
    public b: number,
    public a = 1,
  ) {}

  map (mapper: (n: number) => number) {
    return [this.r, this.g, this.b].map(mapper).concat(this.a) as [number, number, number, number]
  }

  toString (): string {
    return toSRgb(this).toString()
  }

  valueOf () {
    return [this.r,this.g,this.b,this.a]
  }

  static fromSRgb (orig: Srgba) {
    if (!(orig instanceof Srgba)) {
      throw new Error('input to fromSRgb must be of type Srgba')
    }

    return new Rgba(...orig.map(c => {
      if (c <= colorConversion.sRgbCutoff) {
        return c / colorConversion.lowRatio
      }
      return Math.pow((c + colorConversion.fix) / (1 + colorConversion.fix), colorConversion.power)
    }))
  }

  static fromHSL (orig: HSLa) {
    if (!(orig instanceof HSLa)) {
      throw new Error('input to fromHSL must be of type HSLa')
    }

    const H = orig.h
    const S = orig.s
    const L = orig.l

    if (S === 0) {
      return new Rgba(L, L, L, orig.a)
    }

    const q = L < 0.5 ? L * (1 + S) : L + S - L * S
    const p = 2 * L - q

    const ts = [
      (H / 360 + 1 / 3) % 1,
      (H / 360),
      (H / 360 + 2 / 3) % 1,
    ]
    const [r, g, b] = ts.map(t => {
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    })

    return new Rgba(r, g, b, orig.a)
  }
}

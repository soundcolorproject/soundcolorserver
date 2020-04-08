
import { colorConversion } from './constants'
import { parseColor } from './parseColor'

import { HSLa } from './toHsl'
import { toSRgb, SRGBa } from './toSRgb'

import { Color } from './types'
import { HSVa } from './toHsv'

export function toRgb (color: Color): RGBa {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color instanceof RGBa) {
    return color
  }

  if (color instanceof HSLa) {
    return RGBa.fromHSL(color)
  }

  if (color instanceof HSVa) {
    return RGBa.fromHSV(color)
  }

  return RGBa.fromSRgb(toSRgb(color))
}

export class RGBa {
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

  static fromSRgb (orig: SRGBa) {
    if (!(orig instanceof SRGBa)) {
      throw new Error('input to fromSRgb must be of type Srgba')
    }

    return new RGBa(...orig.map(c => {
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
      return new RGBa(L, L, L, orig.a)
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

    return new RGBa(r, g, b, orig.a)
  }

  static fromHSV (orig: HSVa) {
    const H = orig.h
    const S = orig.s
    const V = orig.v

    const min = V - (V * S)
    const max = V * S + min
    const mid = V * S * (1 - Math.abs(((H / 60) % 2) - 1)) + min

    let R
    let G
    let B
    if (H < 60) {
      R = max
      G = mid
      B = min
    } else if (H < 120) {
      R = mid
      G = max
      B = min
    } else if (H < 180) {
      R = min
      G = max
      B = mid
    } else if (H < 240) {
      R = min
      G = mid
      B = max
    } else if (H < 300) {
      R = mid
      G = min
      B = max
    } else {
      R = max
      G = min
      B = mid
    }

    return new RGBa(R, G, B, orig.a)
  }
}

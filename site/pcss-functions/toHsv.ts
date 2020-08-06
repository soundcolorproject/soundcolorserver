
import { parseColor } from './parseColor'
import { SRGBa, toSRgb } from './toSRgb'
import { Color } from './types'

export function toHsv (color: Color): HSVa {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color.type === 'HSVa') {
    return color
  }

  return HSVa.fromSRgb(toSRgb(color))
}

function clamp (min: number, value: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export class HSVa {
  readonly type = 'HSVa'

  constructor (
    public h: number,
    public s: number,
    public v: number,
    public a = 1,
  ) {
    this.h = clamp(0, h, 360)
    this.s = clamp(0, s, 1)
    this.v = clamp(0, v, 1)
    this.a = clamp(0, a, 1)
  }

  toString () {
    // TODO: Fix translation back to hex code
    // return toRgb(this).fixSRgb().toString()
    return toSRgb(this).toString()
  }

  valueOf (): [number, number, number, number] {
    return [this.h,this.s,this.v,this.a]
  }

  clone () {
    return new HSVa(this.h, this.s, this.v, this.a)
  }

  static fromSRgb (orig: SRGBa) {
    if (orig.type !== 'SRGBa') {
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

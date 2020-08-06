
import { colorConversion } from './constants'
import { parseColor } from './parseColor'
import { SRGBa, toSRgb } from './toSRgb'
import { Color } from './types'

export function toRgb (color: Color): RGBa {
  if (typeof color === 'string') {
    color = parseColor(color)
  }

  if (color.type === 'RGBa') {
    return color
  }

  return RGBa.fromSRgb(toSRgb(color))
}

export class RGBa {
  readonly type = 'RGBa'

  constructor (
    public r: number,
    public g: number,
    public b: number,
    public a = 1,
  ) {}

  toArray (): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a]
  }

  map (mapper: (n: number) => number) {
    return [this.r, this.g, this.b].map(mapper).concat(this.a) as [number, number, number, number]
  }

  toString () {
    return SRGBa.fromRgb(this).toString()
  }

  valueOf () {
    return [this.r,this.g,this.b,this.a]
  }

  clone () {
    return new RGBa(this.r, this.g, this.b, this.a)
  }

  fixRgb () {
    return toRgb(new SRGBa(...this.toArray()))
  }

  static fromSRgb (orig: SRGBa) {
    if (orig.type !== 'SRGBa') {
      throw new Error('input to fromSRgb must be of type Srgba')
    }

    return new RGBa(...orig.map(c => {
      if (c <= colorConversion.sRgbCutoff) {
        return c / colorConversion.lowRatio
      }
      return Math.pow((c + colorConversion.fix) / (1 + colorConversion.fix), colorConversion.power)
    }))
  }
}

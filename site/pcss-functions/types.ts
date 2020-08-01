
import { HSLa } from './toHsl'
import { HSVa } from './toHsv'
import { RGBa } from './toRgb'
import { SRGBa } from './toSRgb'

export type ParsedColor = HSVa | HSLa | RGBa | SRGBa
export type Color = ParsedColor | string


import { modularScale } from './constants'

const { base, unit, ratio } = modularScale

export function ms (factor: number | string) {
  if (typeof factor === 'string') factor = parseFloat(factor)
  const multiplier = Math.pow(ratio, factor)

  return `${base * multiplier}${unit}`
}

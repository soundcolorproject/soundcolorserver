
const rgbFix = 0.055
const rgbLowRatio = 12.92
const rgbPower = 2.4
const sRgbCutoff = 0.0404482362771082
const c = 0.05
const centralLum = -c + Math.sqrt(c + (c * c))

export const colorConversion = {
  fix: rgbFix,
  lowRatio: rgbLowRatio,
  power: rgbPower,
  sRgbCutoff,
  lumContrastConstant: c,
  centralLum,
}

function makeComplianceMap (contrastRatio: number) {
  return {
    contrastRatio,
    minLumOnBlack: (contrastRatio * c) - c,
    maxLumOnWhite: ((1 + c) / c) - c,
  }
}

export const wcag = {
  aa: makeComplianceMap(4.5),
  aaa: makeComplianceMap(7),
}

export const defaultColors = {
  black: '#0F0E0D',
  white: '#E7DFDD',
  primary: '#007B9C',
  secondary: '#860A3B',
  tertiary: '#356007',
}

export const modularScale = {
  base: 1,
  unit: 'rem',
  ratio: 1.5,
}

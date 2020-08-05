
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
  'black': '#1B2128',
  'grey-90': '#29333E',
  'grey-80': '#3A4857',
  'grey-70': '#4E5D6D',
  'grey-60': '#616D7A',
  'grey-50': '#6C7681',
  'grey-40': '#86919C',
  'grey-30': '#9CA3AB',
  'grey-20': '#BAC0C7',
  'grey-10': '#CED1D5',
  'grey-05': '#EBECEE',
  'grey-03': '#F5F6F6',
  'white': '#FFFFFF',
}

export const modularScale = {
  base: 1,
  unit: 'rem',
  ratio: 1.5,
}

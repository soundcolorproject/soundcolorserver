
function leftPad (num: string) {
  return num.length > 1 ? num : `0${num}`
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSV {
  h: number
  s: number
  v: number
}

export function rgbToHsv ({ r, g, b }: RGB): HSV {
  let h: number
  let s: number
  let v: number
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  if (max === r) {
    h = (6 + ((g - b) / delta)) % 6
  } else if (max === g) {
    h = 2 + ((b - r) / delta)
  } else { // max === b
    h = 4 + ((r - g) / delta)
  }
  h *= 60
  if (max === 0) {
    s = 0
  } else {
    s = delta / max
  }
  v = max

  return { h, s, v }
}

export function hexToRgb (hex: string): RGB {
  let r: number
  let g: number
  let b: number
  if (!hex.startsWith('#')) {
    return { r: 0, g: 0, b: 0 }
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16) / 255
    g = parseInt(hex.substring(3, 5), 16) / 255
    b = parseInt(hex.substring(5, 7), 16) / 255
  } else if (hex.length === 4) {
    r = parseInt(hex[1], 16) / 16
    g = parseInt(hex[2], 16) / 16
    b = parseInt(hex[3], 16) / 16
  } else {
    r = 0
    g = 0
    b = 0
  }
  return { r, g, b }
}

export function hexToHsv (hex: string): HSV {
  return rgbToHsv(hexToRgb(hex))
}

export function hsvToRgb ({ h, s, v }: HSV): RGB {
  const min = v - (v * s)
  const max = v * s + min
  const mid = v * s * (1 - Math.abs(((h / 60) % 2) - 1)) + min
  let r: number
  let g: number
  let b: number
  if (h < 60) {
    r = max
    g = mid
    b = min
  } else if (h < 120) {
    r = mid
    g = max
    b = min
  } else if (h < 180) {
    r = min
    g = max
    b = mid
  } else if (h < 240) {
    r = min
    g = mid
    b = max
  } else if (h < 300) {
    r = mid
    g = min
    b = max
  } else {
    r = max
    g = min
    b = mid
  }

  return { r, g, b }
}

export function rgbToHex ({ r, g, b }: RGB): string {
  const rHex = leftPad(Math.floor(r * 255).toString(16))
  const gHex = leftPad(Math.floor(g * 255).toString(16))
  const bHex = leftPad(Math.floor(b * 255).toString(16))

  return `#${rHex}${gHex}${bHex}`
}

export function hsvToHex (hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv))
}

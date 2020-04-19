
export function randDigit (base = 36) {
  return Math.floor(Math.random() * base).toString(base)
}

export function randStr (length = 8) {
  let value = ''
  for (let i = 0; i < length; i++) {
    value += randDigit()
  }

  return value.toUpperCase()
}

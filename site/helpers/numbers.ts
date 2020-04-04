
export function printDigits (num: number, digits: number) {
  let str = num.toString(10)
  if (str.indexOf('.') < 0) {
    return str
  } else {
    let [whole, fractional] = str.split('.')
    fractional = fractional.substring(0, digits)
    const allZeroes = fractional.split('').reduce((z, d) => z && d === '0', true)
    if (allZeroes) {
      return whole
    } else {
      return `${whole}.${fractional}`
    }
  }
}

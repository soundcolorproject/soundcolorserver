
import { randomBytes } from 'crypto'
import { promisify } from 'util'

const letters = 'abcdefghijklmnopqrstuvwxyz'
export function randomLetter () {
  const num = Math.floor(Math.random() * letters.length)
  const capital = Math.random() < 0.5
  const letter = letters[num]
  return capital ? letter.toUpperCase() : letter
}

const randomBytesAsync = promisify(randomBytes)
export async function randomString (length: number) {
  length = Math.max(1, length)
  const byteLength = Math.ceil(length * 6 / 8)
  const byteBuffer = await randomBytesAsync(byteLength)
  return byteBuffer.toString('base64').substring(0, length)
}

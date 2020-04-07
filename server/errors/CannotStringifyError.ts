
export class CannotStringifyError extends Error {
  constructor (name: string) {
    super(`Cannot JSON.stringify ${name} due to security vulnerability.`)
  }
}


export class FatalError extends Error {
  constructor (
    public readonly exitCode: number,
    message: string,
  ) {
    super(message)
  }
}

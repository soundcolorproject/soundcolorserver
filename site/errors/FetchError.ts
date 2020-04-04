
export class FetchError extends Error {
  public readonly status: number

  constructor (
    public readonly response: Response,
    public readonly data: any,
  ) {
    super(`${response.status} ${response.statusText} -- ${response.url}`)
    this.status = response.status
  }
}

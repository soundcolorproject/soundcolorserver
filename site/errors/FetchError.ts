
import { ServerErrorResponse } from '../../shared/ServerErrorResponse'

export class FetchError extends Error {
  public readonly status: number

  constructor (
    public readonly response: Response,
    public readonly data: ServerErrorResponse,
  ) {
    super(`${response.status} ${response.statusText} -- ${response.url}`)
    this.status = response.status
  }
}

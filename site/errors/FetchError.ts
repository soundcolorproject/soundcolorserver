
import { ServerErrorResponse } from '../../shared/ServerErrorResponse'

export class FetchError extends Error {
  public readonly status: number

  constructor (
    public readonly response: Response | null,
    public readonly data: ServerErrorResponse,
  ) {
    super(
      response
        ? `${response.status} ${response.statusText} -- ${response.url}`
        : data.message,
    )

    this.status = response?.status || 0
  }
}

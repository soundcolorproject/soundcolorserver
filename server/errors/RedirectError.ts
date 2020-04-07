
import { ServerError } from './ServerError'

export class RedirectError extends ServerError {
  constructor (
    public readonly redirectTo: string,
    fallbackError?: string,
  ) {
    super(fallbackError, { redirectTo }, 302)
  }
}

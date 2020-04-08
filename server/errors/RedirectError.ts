
import { ServerError, ServerErrorCode } from './ServerError'

export class RedirectError extends ServerError<{ redirectTo: string }> {
  constructor (
    public readonly redirectTo: string,
    fallbackError?: string,
    errorCode = ServerErrorCode.REDIRECTING,
  ) {
    super(
      errorCode,
      fallbackError,
      { redirectTo },
      401,
    )
  }
}

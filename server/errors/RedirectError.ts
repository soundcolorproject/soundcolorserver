
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

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

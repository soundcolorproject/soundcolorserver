
import { ServerError, ServerErrorCode } from './ServerError'

export class InvalidOauthCallbackError extends ServerError {
  constructor () {
    super(
      ServerErrorCode.INVALID_OAUTH_CALLBACK,
      'OAuth callback failed validation',
    )
  }
}

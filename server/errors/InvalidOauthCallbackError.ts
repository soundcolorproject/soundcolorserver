
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export class InvalidOauthCallbackError extends ServerError {
  constructor () {
    super(
      ServerErrorCode.INVALID_OAUTH_CALLBACK,
      'OAuth callback failed validation',
    )
  }
}

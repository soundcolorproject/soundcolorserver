
import { ServerErrorCode } from '../../shared/ServerErrorCode'

import { ServerError } from './ServerError'

export class InvalidOauthCallbackError extends ServerError {
  constructor () {
    super(
      ServerErrorCode.INVALID_OAUTH_CALLBACK,
      'OAuth callback failed validation',
    )
  }
}

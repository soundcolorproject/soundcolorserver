
import { ServerErrorCode } from '../../shared/ServerErrorCode'

import { ServerError } from './ServerError'

export class EmailCredentialsNotFoundError extends ServerError {
  constructor () {
    super(ServerErrorCode.EMAIL_CREDENTIALS_NOT_FOUND, 'Email credentials not found')
  }
}

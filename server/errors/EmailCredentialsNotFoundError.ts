
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export class EmailCredentialsNotFoundError extends ServerError {
  constructor () {
    super(ServerErrorCode.EMAIL_CREDENTIALS_NOT_FOUND, 'Email credentials not found')
  }
}

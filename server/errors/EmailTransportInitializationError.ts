
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export class EmailCredentialsNotFoundError extends ServerError<Error> {
  constructor (cause: Error) {
    super(ServerErrorCode.EMAIL_TRANSPORT_FAILED_TO_INITIALIZE, 'Email transport failed to initialize', cause)
  }
}

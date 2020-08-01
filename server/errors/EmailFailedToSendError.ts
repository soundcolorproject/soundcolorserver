
import { ServerErrorCode } from '../../shared/ServerErrorCode'

import { ServerError } from './ServerError'

export class EmailFailedToSendError extends ServerError<Error> {
  constructor (cause: Error) {
    super(ServerErrorCode.EMAIL_FAILED_TO_SEND, 'Failed to send email', cause)
  }
}

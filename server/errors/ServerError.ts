
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong.  Please try again later'
export class ServerError<T = {}> extends Error {
  constructor (
    public readonly errorCode: ServerErrorCode,
    public readonly errorMessage = DEFAULT_ERROR_MESSAGE,
    public readonly errorData?: T,
    public readonly statusCode = 500,
  ) {
    super(errorMessage)
  }
}

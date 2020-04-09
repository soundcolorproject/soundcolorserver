
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export class DbWriteError extends ServerError {
  constructor (
    public readonly collection: string,
  ) {
    super(ServerErrorCode.DB_WRITE_FAILED)
  }
}


import { ServerErrorCode } from '../../shared/ServerErrorCode'

import { ServerError } from './ServerError'

export class DbWriteError extends ServerError {
  constructor (
    public readonly collection: string,
  ) {
    super(ServerErrorCode.DB_WRITE_FAILED)
  }
}


import { ServerErrorCode } from '../../shared/ServerErrorCode'

import { ServerError } from './ServerError'

export class NoHeaderError extends ServerError<{ headerName: string }> {
  constructor (
    public readonly headerName: string,
  ) {
    super(
      ServerErrorCode.EXPECTED_HEADER,
      `Expected header not found (${headerName})`,
      { headerName },
      400,
    )
  }
}

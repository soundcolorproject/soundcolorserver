
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

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


import { ServerError, ServerErrorCode } from './ServerError'

export class NoLocalBridgesError extends ServerError {
  constructor () {
    super(
      ServerErrorCode.NO_LOCAL_BRIDGES,
      'No hue bridges found on the current local network.',
    )
  }
}

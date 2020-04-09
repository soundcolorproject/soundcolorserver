
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export class NoLocalBridgesError extends ServerError {
  constructor () {
    super(
      ServerErrorCode.NO_LOCAL_BRIDGES,
      'No hue bridges found on the current local network.',
    )
  }
}

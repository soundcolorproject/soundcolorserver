
import { ServerError } from './ServerError'

export class NoLocalBridgesError extends ServerError {
  constructor () {
    super('No hue bridges found on the current local network.')
  }
}

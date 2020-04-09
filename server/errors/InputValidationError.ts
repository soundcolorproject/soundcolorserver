
import { ServerError } from './ServerError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

export class InputValidationError<T extends {}> extends ServerError<{ requiredFields: (keyof T)[] }> {
  constructor (
    public readonly requiredFields: (keyof T)[],
  ) {
    super(
      ServerErrorCode.INPUT_FAILED_VALIDATION,
      `Request body was missing required fields`,
      { requiredFields },
    )
  }
}

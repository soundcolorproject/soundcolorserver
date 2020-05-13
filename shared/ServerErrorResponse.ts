
import { ServerErrorCode } from './ServerErrorCode'

export interface ServerErrorResponse {
  message?: string
  errorCode?: ServerErrorCode
  [key: string]: any
}


export enum ServerErrorCode {
  // General Errors
  UNKNOWN_ERROR = 1,
  REDIRECTING = 2,

  // Request errors
  EXPECTED_HEADER = 100,

  // Database errors
  DB_WRITE_FAILED = 200,

  // OAuth errors
  INVALID_OAUTH_CALLBACK = 300,

  // Hue errors
  NO_LOCAL_BRIDGES = 400,
}

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

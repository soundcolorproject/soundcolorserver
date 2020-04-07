
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong.  Please try again later'
export class ServerError extends Error {
  constructor (
    public readonly errorMessage = DEFAULT_ERROR_MESSAGE,
    public readonly errorData?: any,
    public readonly statusCode = 500,
  ) {
    super(errorMessage)
  }
}

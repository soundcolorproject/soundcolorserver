
export enum FatalErrorCode {
  UNKNOWN_CAUSE = 1,

  // Server / listen related
  EXPECTED_PORT_FAILED_TO_OPEN = 10,
  NO_AVAILABLE_PORTS = 11,

  // DB related
  MONGODB_CONNECTION_FAILED = 20,
}

export class FatalError extends Error {
  constructor (
    public readonly exitCode: FatalErrorCode,
    message: string,
    public readonly cause?: Error,
  ) {
    super(message)
  }
}

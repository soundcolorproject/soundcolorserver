
export enum ServerErrorCode {

  // General Errors
  OFFLINE = 0,
  UNKNOWN_ERROR = 1,
  REDIRECTING = 2,

  // Request errors
  INPUT_FAILED_VALIDATION = 100,
  EXPECTED_HEADER = 101,

  // Database errors
  DB_WRITE_FAILED = 200,

  // OAuth errors
  INVALID_OAUTH_CALLBACK = 300,

  // Hue errors
  NO_LOCAL_BRIDGES = 400,
}


// tslint:disable: no-console
export type LogLevelStr = 'debug' | 'info' | 'log' | 'warn' | 'error' | 'fatal' | 'none'

export enum LogLevel {
  debug = 0,
  info = 1,
  log = 2,
  warn = 3,
  error = 4,
  fatal = 5,
  none = 6,
}

declare const __LOG_LEVEL__: any
export const validLevels = Object.keys(LogLevel).filter(level => Number.isNaN(parseFloat(level))) as LogLevelStr[]
const defaultLogLevel: LogLevelStr = 'warn'
function computeLogLevel (): LogLevelStr {
  try {
    if (typeof __LOG_LEVEL__ === 'string') {
      return __LOG_LEVEL__ as LogLevelStr
    }
    const index = validLevels.indexOf(process.env.LOG_LEVEL?.toLowerCase() as LogLevelStr)
    if (index >= 0) {
      const level = validLevels[index]
      console.info(`Using log level ${level}`)
      return level
    } else {
      if (process.env.LOG_LEVEL) {
        console.warn(`LOG_LEVEL ${process.env.LOG_LEVEL} is invalid.`)
        console.warn(`Valid options are [${validLevels.join(', ')}].`)
        console.warn(`Falling back to default level, which is ${defaultLogLevel}`)
      }
      return defaultLogLevel
    }
  } catch (e) {
    return defaultLogLevel
  }
}

let logLevel: LogLevelStr | null = null
export function getLogLevel (): LogLevelStr {
  if (!logLevel) {
    logLevel = computeLogLevel()
  }

  return logLevel
}

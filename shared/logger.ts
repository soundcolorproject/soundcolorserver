
// tslint:disable: no-console
import * as ac from 'ansi-colors'
import { LogLevel, getLogLevel, LogLevelStr, validLevels } from './getLogLevel'
import { isBrowser } from './isBrowser'
import { browserAnsi } from './browserAnsi'

let colors: typeof ac | null = null
try {
  if (!isBrowser()) {
    colors = require('ansi-colors')
  }
} catch (e) {
  // do nothing
}

type LogFunc = (...args: any[]) => void
type StyleFunc = (input: string) => string
type StyleName = keyof ac.StylesType<any>

const textIdent = (text: string) => text
function getStyleFunc (style: StyleName[]): StyleFunc {
  if (colors && style.length > 0) {
    const styleFn = style.slice(1).reduce((fn, name) => fn[name], colors[style[0]])
    return styleFn
  } else {
    return textIdent
  }
}

function getBrowserAnsi (style: StyleName[]): string {
  if (style.length === 0) {
    return ''
  }

  return style.slice(1).reduce((style, name) => style[name], browserAnsi[style[0]]).toString()
}

interface LogTarget {
  level: LogLevel
}

const useStack = typeof new Error().stack === 'string'
function createLogFunc (target: LogTarget, expected: LogLevel, logger: LogFunc, prefix: string, style: StyleName[] = []): LogFunc {
  if (prefix) {
    prefix = `${prefix}:`
  }

  if (isBrowser()) {
    const styleStr = getBrowserAnsi(style)
    if (!styleStr) {
      return (...args: any[]) => {
        if (expected < target.level) return
        logger(prefix, ...args)
      }
    }
    return (...args: any[]) => {
      if (expected < target.level) return
      let format = `%c${prefix} ` + args.map(arg => {
        switch (typeof arg) {
          case 'string':
            return '%s'
          case 'number':
            if (arg % 1 === 0) {
              return '%d'
            } else {
              return '%f'
            }
          case 'bigint':
            return '%d'
          default:
            return '%o'
        }
      }).join(' ')
      if (useStack) {
        format += `\n${new Error().stack?.split('\n')[2]}`
      }
      logger(format, styleStr, ...args)
    }
  } else {
    const styleFn = getStyleFunc(style)
    return (...args: any[]) => {
      if (expected < target.level) return
      const str = args.reduce((str, arg) => {
        if (typeof arg === 'object') {
          if (arg.constructor.name === 'ApiError') {
            const err = arg.getHueError()
            arg = `${arg.message} ${JSON.stringify(err.payload, null, 2)}`
          } else if (arg instanceof Error) {
            arg = arg.stack
          } else {
            try {
              arg = JSON.stringify(arg, null, 2)
            } catch (e) {
              // noop
            }
          }
        }
        return `${str} ${arg}`
      }, prefix)
      logger(styleFn(str))
    }
  }
}

function createLogger () {
  const target = { level: LogLevel[getLogLevel()] }
  const logger = {
    debug: createLogFunc(target, LogLevel.debug, console.debug, 'DEBUG', ['underline']),
    info: createLogFunc(target, LogLevel.info, console.info, 'INFO', ['cyan']),
    log: createLogFunc(target, LogLevel.log, console.log, 'LOG'),
    warn: createLogFunc(target, LogLevel.warn, console.warn, 'WARNING', ['yellow']),
    error: createLogFunc(target, LogLevel.error, console.error, 'ERROR', ['red', 'bold']),
    fatal: createLogFunc(target, LogLevel.fatal, console.error, '🔥 FATAL', ['red', 'bold']),
    set logLevel (newLevel: LogLevelStr) {
      const levelValue = LogLevel[newLevel]

      // tslint:disable-next-line: strict-type-predicates
      if (levelValue !== undefined) {
        target.level = levelValue
        console.log(`Log level set to ${newLevel} (${levelValue})`)
      } else {
        console.log(`Log level "${newLevel}" not recognized.  Valid log levels are: [${validLevels.join(', ')}]`)
      }
    },
    get logLevel () {
      return LogLevel[target.level] as LogLevelStr
    },
  }

  return logger
}

export const logger = createLogger()

declare const window: any
declare const global: any
if (typeof (globalThis as any) !== 'undefined') {
  (globalThis as any).logger = logger
} else if (typeof window !== 'undefined') {
  window.logger = logger
} else if (typeof global !== 'undefined') {
  global.logger = logger
}

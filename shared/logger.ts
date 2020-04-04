
// tslint:disable: no-console
import * as ac from 'ansi-colors'
import { LogLevel, getLogLevel } from './getLogLevel'

let colors: typeof ac | null = null
try {
  colors = require('ansi-colors')
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

const noop = () => { /* noop */ }
function createLogFunc (target: LogLevel, expected: LogLevel, logger: LogFunc, prefix: string, style: StyleName[] = []): LogFunc {
  const styleFn = getStyleFunc(style)
  if (expected >= target) {
    if (prefix) {
      prefix = `${prefix}: `
    }
    return (...args: any[]) => {
      const str = args.reduce((str, arg) => str + arg.toString(), prefix)
      logger(styleFn(str))
    }
  } else {
    return noop
  }
}

function createLogger () {
  const target = LogLevel[getLogLevel()]
  return {
    debug: createLogFunc(target, LogLevel.debug, console.debug, 'DEBUG', ['underline']),
    info: createLogFunc(target, LogLevel.info, console.info, 'INFO', ['cyan']),
    log: createLogFunc(target, LogLevel.log, console.log, 'LOG'),
    warn: createLogFunc(target, LogLevel.log, console.warn, 'WARNING', ['yellow']),
    error: createLogFunc(target, LogLevel.log, console.error, 'ERROR', ['red', 'bold']),
    fatal: createLogFunc(target, LogLevel.log, console.error, '🔥 FATAL', ['red', 'bold']),
  }
}

export const logger = createLogger()

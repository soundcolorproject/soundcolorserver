
import * as ac from 'ansi-colors'

type BrowserAnsi = ac.StylesType<BrowserAnsi>
type AnsiState = { [key: string]: string }

const brightColors = {
  black: '',
  red: '',
  green: '',
  yellow: '',
  blue: '',
  magenta: '',
  cyan: '',
  white: '',
}

const DEFAULT_STATE: AnsiState = { display: 'block' }

function buildAnsi (state: AnsiState = DEFAULT_STATE): BrowserAnsi {
  const output = {
    toString: () => {
      const keys = Object.keys(state)
      return keys.slice(1).reduce(
        (str, key) => `${str}; ${key}: ${state[key]}`,
        `${keys[0]}: ${state[keys[0]]}`,
      )
    },
  } as BrowserAnsi
  function appendStyle (newState: AnsiState): { get (): BrowserAnsi } {
    return { get: () => buildAnsi({ ...state, ...newState }) }
  }

  function fg (color: string) {
    return { get: () => buildAnsi({ ...state, 'foreground-color': color }) }
  }

  function fgBright (name: keyof typeof brightColors) {
    return fg(brightColors[name])
  }

  function bg (color: string) {
    return { get: () => buildAnsi({ ...state, 'background-color': color }) }
  }

  function bgBright (name: keyof typeof brightColors) {
    return bg(brightColors[name])
  }

  const descriptors: ac.StylesType<{ get (): BrowserAnsi }> = {
    reset: { get () { return buildAnsi() } },
    bold: appendStyle({ 'font-weignt': 'bold' }),
    dim: appendStyle({ 'opacity': '0.75' }),
    italic: appendStyle({ 'font-style': 'italic' }),
    underline: appendStyle({ 'text-decoration': 'underline' }),
    hidden: appendStyle({ 'opacity': '0' }),
    strikethrough: appendStyle({ 'text-decoration': 'line-through' }),
    inverse: {
      get () {
        return buildAnsi({
          ...state,
          'foreground-color': state['background-color'],
          'background-color': state['foreground-color'],
        })
      },
    },

    black: fg('black'),
    red: fg('red'),
    green: fg('green'),
    yellow: fg('yellow'),
    blue: fg('blue'),
    magenta: fg('magenta'),
    cyan: fg('cyan'),
    white: fg('white'),
    gray: fg('gray'),
    grey: fg('grey'),

    blackBright: fgBright('black'),
    redBright: fgBright('red'),
    greenBright: fgBright('green'),
    yellowBright: fgBright('yellow'),
    blueBright: fgBright('blue'),
    magentaBright: fgBright('magenta'),
    cyanBright: fgBright('cyan'),
    whiteBright: fgBright('white'),

    bgBlack: bg('black'),
    bgRed: bg('red'),
    bgGreen: bg('green'),
    bgYellow: bg('yellow'),
    bgBlue: bg('blue'),
    bgMagenta: bg('magenta'),
    bgCyan: bg('cyan'),
    bgWhite: bg('white'),

    bgBlackBright: bgBright('black'),
    bgRedBright: bgBright('red'),
    bgGreenBright: bgBright('green'),
    bgYellowBright: bgBright('yellow'),
    bgBlueBright: bgBright('blue'),
    bgMagentaBright: bgBright('magenta'),
    bgCyanBright: bgBright('cyan'),
    bgWhiteBright: bgBright('white'),
  }

  Object.defineProperties(output, descriptors as any)

  return output
}

export const browserAnsi: BrowserAnsi = buildAnsi()

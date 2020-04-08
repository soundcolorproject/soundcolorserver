
import { observable, reaction } from 'mobx'
import { getAnalyser } from '../../audio/analyzer'
import { getMiniAnalyser } from '../../audio/miniAnalyser'
import { toHsv, HSVa } from '../../pcss-functions/toHsv'

const defaultCustomColors = {
  'C': toHsv('#E2CF0B'),
  'C#': toHsv('#FFE50C'),
  'D': toHsv('#35C80B'),
  'D#': toHsv('#0B33A5'),
  'E': toHsv('#19BDA2'),
  'F': toHsv('#835BD9'),
  'F#': toHsv('#774ACB'),
  'G': toHsv('#E4C5DD'),
  'G#': toHsv('#E0BFD7'),
  'A': toHsv('#A30008'),
  'A#': toHsv('#9B1A6F'),
  'B': toHsv('#BA000A'),
}

export type PatternsStore = typeof patternsStore

export interface PatternsProp {
  patterns: PatternsStore
}

export type Note = keyof typeof defaultCustomColors
export type ColorMap = { [key in Note]: HSVa }

function getCustomColorValue (name: string, note: Note) {
  const storageVal = localStorage.getItem(`custom:${name}:${note}`)
  if (storageVal) {
    try {
      return toHsv(storageVal)
    } catch (e) {
      const color = defaultCustomColors[note]
      saveCustommColorValue(name, note, color)
      return color
    }
  } else {
    return defaultCustomColors[note]
  }
}

function saveCustommColorValue (name: string, note: Note, value: HSVa) {
  localStorage.setItem(`custom:${name}:${note}`, value.toString())
}

type CustomColorMap = ColorMap & {
  clearReactions: () => void
  reset: () => void
}
function getCustomColors (name = 'current') {
  const colors = observable<CustomColorMap>(Object.keys(defaultCustomColors).reduce((full, note: Note) => ({
    ...full,
    [note]: getCustomColorValue(name, note),
  }), {} as CustomColorMap))
  const disposers: (() => void)[] = []
  Object.keys(defaultCustomColors).forEach((note: Note) => (
    disposers.push(reaction(
      () => colors[note],
      (value) => saveCustommColorValue(name, note, value),
    ))
  ))
  colors.clearReactions = () => disposers.forEach(d => d())
  colors.reset = () => {
    Object.keys(defaultCustomColors).forEach((note: Note) => {
      colors[note] = defaultCustomColors[note]
    })
  }
  return colors
}

export type PatternName =
  | 'chakras'
  | 'chromesthesia'
  | 'emotion'
  | 'chromotherapy'
  | 'adolescence'
  | 'custom'

export const patternsStore = observable({
  transitionSpeed: 0.9,
  noiseMultiplier: 1,
  vibranceMultiplier: 2.5,
  toneSigma: 0,
  timeSmoothing: 0.8,
  monochrome: false,
  currentPattern: '' as PatternName,
  patternData: {
    chakras: {
      label: 'Chakras',
      colors: {
        'C': toHsv('#EC472D'),
        'C#': toHsv('#EC5F2D'),
        'D': toHsv('#EC972D'),
        'D#': toHsv('#F6AB0B'),
        'E': toHsv('#F6D70B'),
        'F': toHsv('#40C070'),
        'F#': toHsv('#40C0AD'),
        'G': toHsv('#0080FF'),
        'G#': toHsv('#1369EB'),
        'A': toHsv('#204ADA'),
        'A#': toHsv('#5C22ED'),
        'B': toHsv('#9D32F5'),
      },
    },
    chromesthesia: {
      label: 'Chromesthesia',
      colors: {
        'C': toHsv('#B2B9CD'),
        'C#': toHsv('#8D3B4C'),
        'D': toHsv('#E1BF5C'),
        'D#': toHsv('#BA64E1'),
        'E': toHsv('#3793B4'),
        'F': toHsv('#A0A883'),
        'F#': toHsv('#69B777'),
        'G': toHsv('#F56A4E'),
        'G#': toHsv('#8B2F64'),
        'A': toHsv('#EC9F40'),
        'A#': toHsv('#D3BD8D'),
        'B': toHsv('#D3BED9'),
      },
    },
    emotion: {
      label: 'Emotion',
      colors: {
        'C': toHsv('#0E74D9'),
        'C#': toHsv('#4BB0FF'),
        'D': toHsv('#C80006'),
        'D#': toHsv('#0F7102'),
        'E': toHsv('#17AA05'),
        'F': toHsv('#FD6809'),
        'F#': toHsv('#3F31FF'),
        'G': toHsv('#0000BD'),
        'G#': toHsv('#FC0007'),
        'A': toHsv('#FFE744'),
        'A#': toHsv('#FFFF43'),
        'B': toHsv('#D400D6'),
      },
    },
    chromotherapy: {
      label: 'Chromotherapy',
      colors: {
        'C': toHsv('#46680e'),
        'C#': toHsv('#4a996b'),
        'D': toHsv('#23778f'),
        'D#': toHsv('#2c3358'),
        'E': toHsv('#e37081'),
        'F': toHsv('#934682'),
        'F#': toHsv('#40C0AD'),
        'G': toHsv('#fc5719'),
        'G#': toHsv('#a43a11'),
        'A': toHsv('#fd7d0f'),
        'A#': toHsv('#fd9f18'),
        'B': toHsv('#fdb217'),
      },
    },
    adolescence: {
      label: 'Adolescence',
      colors: {
        'C': toHsv('#E2CF0B'),
        'C#': toHsv('#FFE50C'),
        'D': toHsv('#35C80B'),
        'D#': toHsv('#0B33A5'),
        'E': toHsv('#19BDA2'),
        'F': toHsv('#835BD9'),
        'F#': toHsv('#774ACB'),
        'G': toHsv('#E4C5DD'),
        'G#': toHsv('#E0BFD7'),
        'A': toHsv('#A30008'),
        'A#': toHsv('#9B1A6F'),
        'B': toHsv('#BA000A'),
      },
    },
    custom: {
      label: 'Custom',
      colors: getCustomColors(),
    },
  },
  notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'] as Note[],
})

reaction(
  () => patternsStore.timeSmoothing,
  async (smoothing) => {
    const analysers = await Promise.all([getAnalyser(), getMiniAnalyser()])
    analysers.forEach(analyser => analyser.smoothingTimeConstant = smoothing)
  },
)

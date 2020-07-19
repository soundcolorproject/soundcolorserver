
import { observable, reaction, action } from 'mobx'
import { getAnalyser } from '../../audio/analyzer'
import { getMiniAnalyser } from '../../audio/miniAnalyser'
import { toHsv, HSVa } from '../../pcss-functions/toHsv'
import { randStr } from '../../helpers/random'
import { errorString } from '../../../shared/errorHelpers'

const defaultCustomColors = {
  'C': toHsv('#B4BBCC'),
  'C#': toHsv('#A1B4CE'),
  'D': toHsv('#8EADD0'),
  'D#': toHsv('#7AA7D2'),
  'E': toHsv('#67A0D4'),
  'F': toHsv('#5499D6'),
  'F#': toHsv('#4192D8'),
  'G': toHsv('#2D8BDA'),
  'G#': toHsv('#1A84DC'),
  'A': toHsv('#EED0C6'),
  'A#': toHsv('#DBC9C8'),
  'B': toHsv('#C7C2CA'),
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
      saveCustomColorValue(name, note, color)
      gtag('event', 'exception', {
        description: 'Failed to parse custom color from localStorage: ' + errorString(e),
        event_label: 'local storage color parse exception',
      })
      return color
    }
  } else {
    return defaultCustomColors[note]
  }
}

interface Favorite {
  key: string
  created: Date
}
function getFavoriteList (): Favorite[] {
  const faveStr = localStorage.getItem(`custom:favorites`)
  if (!faveStr) {
    return []
  }

  try {
    const faves = JSON.parse(faveStr) as Favorite[]
    return faves.map(({ key, created }) => ({
      key,
      created: new Date(created),
    }))
  } catch (e) {
    gtag('event', 'exception', {
      description: 'Failed to parse custom color saves from localStorage: ' + errorString(e),
      event_label: 'custom color saves exception',
    })
    return []
  }
}

function addFavoriteToList (key: string) {
  const faves = getFavoriteList()
  faves.push({
    key,
    created: new Date(),
  })
  localStorage.setItem(`custom:favorites`, JSON.stringify(faves))

  return faves
}

function deleteFavorite (key: string) {
  const faves = getFavoriteList().filter(fave => (
    fave.key !== key
  ))

  notes.forEach(note => {
    localStorage.removeItem(`custom:${key}:${note}`)
  })

  localStorage.setItem(`custom:favorites`, JSON.stringify(faves))
}

function saveFavorite () {
  const name = randStr()

  const colors = patternsStore.patternData.custom.colors
  notes.forEach(note => {
    saveCustomColorValue(name, note, colors[note])
  })

  addFavoriteToList(name)

  return name
}

export interface FavoriteData {
  created: Date
  colors: typeof defaultCustomColors
}
export interface Favorites {
  [key: string]: FavoriteData
}
function getFavorites (): Favorites {
  const favorites: Favorites = {}
  const faveNames = getFavoriteList()

  faveNames.forEach(({ key, created }) => {
    const values = favorites[key] = {
      created,
      colors: {},
    } as FavoriteData

    notes.forEach(note => {
      values.colors[note] = getCustomColorValue(key, note)
    })
  })

  return favorites
}

function saveCustomColorValue (name: string, note: Note, value: HSVa) {
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
      (value) => saveCustomColorValue(name, note, value),
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

export const notes = Object.freeze<Note[]>([
  'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
])

function formatDescription (desc: string) {
  return desc.replace(/\n/g, '').replace(/\s+/g, ' ')
}

export const patternsStore = observable({
  transitionSpeed: 0.9,
  noiseMultiplier: 1,
  vibranceMultiplier: 2.5,
  minimumBrightness: 0,
  toneSigma: 0,
  timeSmoothing: 0.8,
  monochrome: false,
  currentPattern: '' as PatternName,
  patternNames: ['chakras', 'chromesthesia', 'emotion', 'chromotherapy', 'adolescence', 'custom'] as PatternName[],
  patternData: {
    chakras: {
      label: 'Chakras',
      buttonNoteColor: 'G' as Note,
      description: formatDescription(`
        Referencing the points of the energy in the body, they are often used to find spiritual or concious balance
        through meditation.Each chakra — root, sacral, solar plexus, heart, throat, third eye, and crown — are
        represented by the colors of the rainbow, starting at the bottom (root) of the body with red to the top (crown)
        with violet. Every chakra, or energy in the body, is also in tune with a specific frequency or note, commonly
        connected to through instruments like singing bowls. The spectrum of color in the rainbow depicts the order in
        the body in which we are to return through the practice of attention on the inner self.
      `),
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
      buttonNoteColor: 'A#' as Note,
      description: formatDescription(`
        Also known as sound-color synesthesia, this pattern is based on phenomenon in which those who experience it
        (less than 1 in every 2,000 people) hear sounds and see colors. It has been described as a sort of 'film of
        color' in front of ones field of vision. Typically, those who experience chromesthesia also have perfect pitch,
        meaning they can hear a note audibly, and know exactly what note that is. This is likely because they know what
        color represents every note.
      `),
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
      buttonNoteColor: 'B' as Note,
      description: formatDescription(`
        Using Robert Plutchik's emotion wheel, colors are directly related to human emotions. In a similar way
        different genres of music often portray the same emotions. By looking at what genres commonly evoke certain
        emotions, and seeing what are the most frequently used notes and keys in those genres, the colors on the
        emotion wheel can roughly coorelate to musical notes.
      `),
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
      buttonNoteColor: 'G' as Note,
      description: formatDescription(`
        Through early research and calculations around chromotherapy, Dinshah Ghadiali experimented exposing colored
        light to people as a form of healing. Using the measurement of electromagnetic waves, the visible spectrum can
        be converted to sound waves, causing colors to correspond to closely relating notes.
      `),
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
      buttonNoteColor: 'E' as Note,
      description: formatDescription(`
        Some times a route to developing chromesthesia, children are introduced to a variety of colors and musical
        sounds at the same time. From pianos and xylophones, to light up sound-making toys, toddlers are exposed and
        begin to relate musical notes to colors while learning and creating coorelations between the two from the
        earliest of developmental phases.
      `),
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
      buttonNoteColor: 'A#' as Note,
      description: formatDescription(`
        We all experience sound and color differently, uniquely in our own ways. Creating our own custom color patterns
        enables us to express ourselves in the way we hear and see.
      `),
      colors: getCustomColors(),
      defaultColors: defaultCustomColors,
    },
  },
  favorites: getFavorites(),
  saveFavorite: action('saveFavorite', () => {
    patternsStore.favoriteKey = saveFavorite()
    patternsStore.favorites = getFavorites()
    patternsStore.hasNewFavorite = true
  }),
  deleteFavorite: action('deleteFavorite', (key: string) => {
    deleteFavorite(key)
    if (patternsStore.favoriteKey === key) {
      patternsStore.favoriteKey = null
    }
    patternsStore.favorites = getFavorites()
  }),
  loadFavorite: action('loadFavorite', (key: string) => {
    patternsStore.patternData.custom.colors = getCustomColors(key)
    patternsStore.favoriteKey = key
    patternsStore.currentPattern = 'custom'
  }),
  hasNewFavorite: false,
  favoriteKey: null as string | null,
  notes,
})

reaction(
  () => patternsStore.currentPattern,
  (currentPattern) => {
    gtag('event', 'set_color_pattern', {
      event_category: 'color_pattern',
      pattern_id: currentPattern,
    })
  },
)

reaction(
  () => notes.map(note => (
    patternsStore.patternData.custom.colors[note]
  )),
  () => {
    patternsStore.favoriteKey = null
  },
)

reaction(
  () => patternsStore.timeSmoothing,
  async (smoothing) => {
    const analysers = await Promise.all([getAnalyser(), getMiniAnalyser()])
    analysers.forEach(analyser => analyser.smoothingTimeConstant = smoothing)
  },
)

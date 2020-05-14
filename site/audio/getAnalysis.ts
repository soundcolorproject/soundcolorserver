
import { context } from './context'
import { getFft, fftSize } from './analyzer'
import { getNoteInformation, NoteInfo } from './getNoteInformation'
import { patternsStore } from '../state/patternsStore'
import { logger } from '../../shared/logger'

export const MIN_FOR_STATS = -100
export const MAX_TONES = 3
const MAX_STRENGTHS = MAX_TONES * 10
const DEFAULT_STATS = {
  dB: {
    mean: -1000,
    deviation: 0,
  },
  volume: {
    mean: 1 / (2 ** 100),
    deviation: 0,
  },
  counted: 0,
}

function getStats (fft: Float32Array) {
  const meanStats = fft.reduce((val, curr, idx) => {
    if (curr > MIN_FOR_STATS) {
      val.total += curr
      val.count++
    }
    return val
  }, { total: 0, count: 0 })
  if (meanStats.count === 0) {
    return DEFAULT_STATS
  }
  const meandB = meanStats.total / meanStats.count

  const varianceStats = fft.reduce((val, curr, idx) => {
    if (curr > MIN_FOR_STATS) {
      val.total += (curr - meandB) ** 2
      val.count++
    }
    return val
  }, { total: 0, count: 0 })
  const deviationdB = Math.sqrt(varianceStats.total / varianceStats.count)

  const mean = dBtoVolume(meandB)
  const deviation = dBtoVolume(deviationdB)

  return {
    dB: {
      mean: meandB,
      deviation: deviationdB,
    },
    volume: {
      mean: mean,
      deviation: deviation,
    },
    counted: meanStats.count,
  }
}

interface ToneStrength {
  value: number
  idx: number
}

export interface ToneInfo {
  dB: number
  frequency: number
  harmonics: number
  note: NoteInfo
}

function getStrongestValues (fft: Float32Array, minToCount: number) {
  const strongest: ToneStrength[] = []
  function addIfHigher (value: number, idx: number) {
    const previous = fft[idx - 1] || -Infinity
    const next = fft[idx + 1] || -Infinity
    const isLocalMaximum = previous < value && next < value
    if (!isLocalMaximum || value < minToCount || idx === 0) {
      return
    }

    const obj = {
      value: value,
      idx: idx,
    }
    if (strongest.length === 0) {
      strongest.push(obj)
      return
    } else {
      let insertionIndex = -1
      for (let i = 0; i < strongest.length; i++) {
        if (value > strongest[i].value) {
          insertionIndex = i
          break
        }
      }
      if (insertionIndex === -1 && strongest.length < MAX_STRENGTHS) {
        strongest.push(obj)
      } else if (insertionIndex >= 0) {
        strongest.splice(insertionIndex, 0, obj)
        if (strongest.length > MAX_STRENGTHS) {
          strongest.splice(MAX_STRENGTHS, 1)
        }
      }
    }
  }

  fft.forEach(addIfHigher)

  logger.info('getStrongestValues output', strongest.map(({ idx, value }) => {
    const frequency = idx * (context.sampleRate) / fftSize
    return {
      frequency,
      dB: value,
    }
  }))

  return strongest
}

function getTones (strengths: ToneStrength[]): ToneInfo[] {
  let tones = strengths.map(({ value, idx }) => {
    const frequency = idx * (context.sampleRate) / fftSize

    return {
      dB: value,
      frequency: frequency,
      harmonics: 1,
      note: getNoteInformation(frequency),
    }
  })

  logger.info('getTones all tones', tones)

  // const notes = tones.map(({ note: { note } }) => note)
  //   .filter((note, idx, notes) => (
  //     !notes.slice(0, idx - 1).includes(note)
  //   ))
  // tones = notes.map(ownNote => {
  //   const ownTones = tones.filter(({ note: { note } }) => note === ownNote)
  //   // const volume = ownTones.map(({ dB }) => dBtoVolume(dB)).reduce((total, v) => total + v)
  //   const dB = tones.reduce((max, { dB }) => Math.max(max, dB), MIN_FOR_STATS)
  //   return {
  //     ...ownTones[0],
  //     // dB: volumeTodB(volume),
  //     dB,
  //   }
  // })
  // .slice(0, MAX_TONES)

  tones = tones.filter(({ dB, note: { note } }, ownIdx) => (
    !tones.slice(0, ownIdx).some((data) => {
      if (data.note.note === note) {
        data.harmonics++
        const volume = dBtoVolume(data.dB) + dBtoVolume(dB)
        data.dB = Math.log2(volume) * 10
        return true
      } else {
        return false
      }
    })
  )).slice(0, MAX_TONES)

  logger.info('getTones output', tones)

  return tones
}

const dBBase = 2
const dBLogFactor = Math.log2(dBBase) / 10
export function dBtoVolume (dB: number) {
  return dBBase ** (dB / 10)
}

export function volumeTodB (volume: number) {
  if (volume <= 0) {
    return -Infinity
  }
  return Math.log2(volume) / dBLogFactor
}

export interface Analysis {
  noise: number
  tones: ToneInfo[]
  fft: Float32Array
}

export function getAnalysis (): Analysis {
  const fft = getFft()
  const stats = getStats(fft)
  const mindB = stats.dB.mean + stats.dB.deviation * patternsStore.toneSigma
  const strongest = getStrongestValues(fft, mindB)
  const tones = getTones(strongest)
  const tonalVolume = tones.reduce((total, { dB }) => total + dBtoVolume(dB), 0)
  const noiseVolume = stats.volume.mean - (tonalVolume / stats.counted)
  const noise = volumeTodB(noiseVolume)

  return {
    noise: noise,
    tones: tones,
    fft,
  }
}

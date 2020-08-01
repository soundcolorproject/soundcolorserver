
import { logger } from '../../shared/logger'
import { patternsStore } from '../state/patternsStore'

import { getContext } from './context'
import { getAudioSource } from './microphoneSource'

export const fftSize = 32768 // maximum size allowed
let analyser: AnalyserNode
let fftArray: Float32Array
let analyserPromise: Promise<AnalyserNode>
let prevSource: AudioNode | null = null
let userMedia: MediaStream | null = null

export async function getAnalyser () {
  if (!analyserPromise) {
    analyserPromise = (async () => {
      const source = prevSource || await getAudioSource()
      prevSource = source

      analyser = getContext().createAnalyser()
      analyser.fftSize = fftSize
      analyser.smoothingTimeConstant = patternsStore.timeSmoothing

      fftArray = new Float32Array(analyser.frequencyBinCount)

      source.connect(analyser)
      return analyser
    })()
  }
  return analyserPromise
}

export function setSource (newSource: AudioNode | null) {
  if (prevSource && analyser) {
    prevSource.disconnect(analyser)
    prevSource.disconnect()
  }
  if (newSource && analyser) {
    newSource.connect(analyser)
  }

  prevSource = newSource
}

const emptyArray = new Float32Array(0)
export function getFft () {
  if (!analyser) {
    return emptyArray
  }

  analyser.getFloatFrequencyData(fftArray)
  logger.info('fft', analyser.frequencyBinCount, fftSize)
  return fftArray
}


import { context } from './context'
import { getAnalyser } from './analyzer'
import { patternsStore } from '../state/patternsStore'
import { logger } from '../../shared/logger'
import { errorString } from '../../shared/errorHelpers'

export const fftSize = 1024
let analyser: AnalyserNode
let fftArray: Float32Array
let analyserPromise: Promise<AnalyserNode>
let prevSource: AudioNode

export async function getMiniAnalyser () {
  if (!analyserPromise) {
    analyserPromise = (async () => {
      const source = prevSource || await getAnalyser()
      prevSource = source

      analyser = context.createAnalyser()
      analyser.fftSize = fftSize
      analyser.smoothingTimeConstant = patternsStore.timeSmoothing

      fftArray = new Float32Array(analyser.frequencyBinCount)

      source.connect(analyser)
      return analyser
    })()
  }
  return analyserPromise
}

export function setSource (newSource: AudioNode) {
  if (prevSource && analyser) {
    prevSource.disconnect(analyser)
  }
  if (analyser) {
    newSource.connect(analyser)
  }

  prevSource = newSource
}

const emptyArray = new Float32Array(0)
export function getMiniFft () {
  if (!analyser) {
    return emptyArray
  }

  analyser.getFloatFrequencyData(fftArray)
  return fftArray
}

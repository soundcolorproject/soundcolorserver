
import { observable, action } from 'mobx'
import { getAnalysis, Analysis } from '../../audio/getAnalysis'
import { getMiniFft } from '../../audio/miniAnalyser'
import { logger } from '../../../shared/logger'

export type AnalysisStore = typeof analysisStore
export interface AnalysisProp {
  analysis: AnalysisStore
}

export const analysisStore = observable<Analysis & { miniFft: Float32Array, paused: boolean }>({
  noise: 0,
  tones: [],
  miniFft: new Float32Array(0),
  fft: new Float32Array(0),
  paused: false,
})

const setAnalysis = action('setAnalysis', ({ noise, tones, fft }: Analysis, miniFft: Float32Array) => {
  analysisStore.noise = noise
  analysisStore.tones = tones
  analysisStore.miniFft = miniFft
  analysisStore.fft = fft
})

let animationFrame = 0
export function startAnalysis () {
  analysisStore.paused = false
  requestAnalysis()
}

export function pauseAnalysis () {
  analysisStore.paused = true
  cancelAnimationFrame(animationFrame)
}

function requestAnalysis () {
  if (analysisStore.paused) {
    return
  }
  setAnalysis(getAnalysis(), getMiniFft())
  animationFrame = requestAnimationFrame(requestAnalysis)
}

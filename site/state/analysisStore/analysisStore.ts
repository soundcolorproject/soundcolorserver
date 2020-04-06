
import { observable, action } from 'mobx'
import { getAnalysis, Analysis } from '../../audio/getAnalysis'
import { getMiniFft } from '../../audio/miniAnalyser'
import { logger } from '../../../shared/logger'

export type AnalysisStore = typeof analysisStore
export interface AnalysisProp {
  analysis: AnalysisStore
}

export const analysisStore = observable<Analysis & { miniFft: Float32Array }>({
  noise: 0,
  tones: [],
  miniFft: new Float32Array(0),
})

const setAnalysis = action('setAnalysis', ({ noise, tones }: Analysis, miniFft: Float32Array) => {
  analysisStore.noise = noise
  analysisStore.tones = tones
  analysisStore.miniFft = miniFft
})

async function requestAnalysis () {
  setAnalysis(getAnalysis(), getMiniFft())
  requestAnimationFrame(requestAnalysis)
}

requestAnalysis().catch(e => {
  logger.warn('Failed to request analysis:', e)
})

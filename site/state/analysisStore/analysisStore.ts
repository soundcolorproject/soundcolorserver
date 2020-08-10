
import { action, observable } from 'mobx'

import { Analysis, getAnalysis, ToneInfo } from '../../audio/getAnalysis'
import { getMiniFft } from '../../audio/miniAnalyser'

export interface AnalysisProp {
  analysis: AnalysisStore
}

export class AnalysisStore implements Analysis {
  private _animationFrame = 0

  @observable noise = 0
  @observable tones: ToneInfo[] = []
  @observable miniFft = new Float32Array(0)
  @observable fft = new Float32Array(0)
  @observable paused = false

  @action
  setAnalysis ({ noise, tones, fft }: Analysis, miniFft: Float32Array) {
    this.noise = noise
    this.tones = tones
    this.fft = fft
    this.miniFft = miniFft
  }

  @action
  startAnalysis () {
    this.paused = false
    this._requestAnalysis()
  }

  @action
  pauseAnalysis () {
    this.paused = true
    cancelAnimationFrame(this._animationFrame)
  }

  private _requestAnalysis = () => {
    if (this.paused) {
      return
    }
    this.setAnalysis(getAnalysis(), getMiniFft())
    this._animationFrame = requestAnimationFrame(this._requestAnalysis)
  }
}

export const analysisStore = new AnalysisStore()

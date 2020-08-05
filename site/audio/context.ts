
import { logger } from '../../shared/logger'
import { renderStateStore } from '../state/renderStateStore'

let context: AudioContext | null = null

export function getContext () {
  if (!context) {
    context = new AudioContext({
      latencyHint: 'playback',
    })
  }

  return context
}

let onResume: () => void
export const resumePromise = new Promise(resolve => {
  onResume = resolve
})

let internalResumePromise: Promise<void>
export function resume () {
  logger.info('resume called')
  if (!internalResumePromise) {
    renderStateStore.showColors = true
    internalResumePromise = getContext().resume().then(onResume)
  }

  return internalResumePromise
}

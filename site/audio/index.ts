
import { errorString } from '../../shared/errorHelpers'
import { logger } from '../../shared/logger'
import { mediaStore } from '../state/mediaStore'

import { getAnalyser, setSource } from './analyzer'
import { getAudioSource, stopUserMedia } from './microphoneSource'
import { getMiniAnalyser } from './miniAnalyser'

export async function startAudio () {
  try {
    setSource(await getAudioSource(mediaStore.currentDeviceId))
    mediaStore.ready = true
  } catch (e) {
    mediaStore.error = true
    gtag('event', 'exception', {
      description: 'Failed to acquire user media: ' + errorString(e),
      event_label: 'user media exception',
    })
  }

  getAnalyser().catch((e) => {
    logger.error('Failed to initialize analyser:', e)
    gtag('event', 'exception', {
      description: 'Failed to initialize analyser: ' + errorString(e),
      event_label: 'analyser exception',
      fatal: true,
    })
  })

  getMiniAnalyser().catch((e) => {
    logger.warn('Failed to initialize mini analyser:', e)
    gtag('event', 'exception', {
      description: 'Failed to initialize mini analyser: ' + errorString(e),
      event_label: 'mini-analyser exception',
    })
  })
}

export async function stopAudio () {
  setSource(null)
  stopUserMedia()
}

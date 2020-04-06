
import { observable } from 'mobx'
import { resume } from '../../audio/context'

import { patternsStore } from '../patternsStore'
import { logger } from '../../../shared/logger'

export interface RenderStateProp {
  renderState: typeof renderStateStore
}

export const renderStateStore = observable({
  showText: true,
  showColors: false,
})

document.addEventListener('keydown', (ev) => {
  if (ev.key === ' ') {
    renderStateStore.showText = !renderStateStore.showText
  } else if (ev.key === 'Enter') {
    if (!patternsStore.currentPattern) {
      patternsStore.currentPattern = 'chakras'
    }
    renderStateStore.showColors = !renderStateStore.showColors
    resume().catch((e) => {
      logger.fatal('Could not resume color pattern:', e)
    })
  } else if (ev.key === 'f') {
    if (document.fullscreenEnabled) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((e) => {
          logger.error('Could not enter fullscreen mode:', e)
        })
      } else {
        document.body.requestFullscreen({
          navigationUI: 'hide',
        }).catch(() => {
          logger.warn('Fullscreen not allowed by user.')
        })
      }
    }
  }
})

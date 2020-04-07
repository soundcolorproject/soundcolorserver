
import { observable, action } from 'mobx'
import { resume } from '../../audio/context'

import { patternsStore, PatternsStore } from '../patternsStore'
import { logger } from '../../../shared/logger'

export type RenderStateStore = typeof renderStateStore

export interface RenderStateProp {
  renderState: RenderStateStore
}

export const renderStateStore = observable({
  showText: true,
  showColors: false,
  isFullscreen: false,
})

export const toggleFullscreen = action(function toggleFullscreen (
  renderState: RenderStateStore = renderStateStore,
) {
  if (document.fullscreenEnabled) {
    if (document.fullscreenElement) {
      renderState.isFullscreen = false
      document.exitFullscreen().catch((e) => {
        logger.error('Could not exit fullscreen mode:', e)
      })
    } else {
      renderState.isFullscreen = true
      document.body.requestFullscreen({
        navigationUI: 'hide',
      }).catch(() => {
        logger.warn('Fullscreen not allowed by user.')
      })
    }
  }
})

export const togglePattern = action(function togglePattern (
  patterns: PatternsStore = patternsStore,
  renderState: RenderStateStore = renderStateStore,
) {
  if (!patterns.currentPattern) {
    patterns.currentPattern = 'chakras'
  }
  renderState.showColors = !renderState.showColors
  resume().catch((e) => {
    logger.fatal('Could not resume color pattern:', e)
  })
})

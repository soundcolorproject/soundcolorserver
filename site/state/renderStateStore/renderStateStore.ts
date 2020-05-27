
import { observable, action, reaction } from 'mobx'
import { resume } from '../../audio/context'
import { logger } from '../../../shared/logger'
import { DEFAULT_SHADER, shaderNames } from '../../containers/ShaderCanvas'

import { patternsStore, PatternsStore } from '../patternsStore'
import { startAnalysis, pauseAnalysis } from '../analysisStore'

export type RenderStateStore = typeof renderStateStore

export interface RenderStateProp {
  renderState: RenderStateStore
}

export const renderStateStore = observable({
  wakeLock: null as WakeLockSentinel | null,
  showText: true,
  showColors: false,
  isFullscreen: false,
  shader: DEFAULT_SHADER,
  shaderSliders: {} as {
    [name: string]: number | undefined
  },
})

reaction(
  () => renderStateStore.showColors,
  (show) => {
    if (show) {
      startAnalysis()
      if (navigator.wakeLock?.request) {
        navigator.wakeLock.request('screen').then(wakeLock => {
          renderStateStore.wakeLock = wakeLock
        }).catch(err => {
          logger.warn('failed to acquire wake lock', err)
        })
      }
    } else {
      pauseAnalysis()
      if (renderStateStore.wakeLock) {
        renderStateStore.wakeLock.release().then(() => {
          renderStateStore.wakeLock = null
        }).catch(err => {
          logger.warn('failed to release wake lock', err)
        })
      }
    }
  },
)

reaction(
  () => renderStateStore.shader,
  (shader) => {
    gtag('event', 'select_content', {
      content_type: 'visualization',
      content_id: shader,
    })
  },
)

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

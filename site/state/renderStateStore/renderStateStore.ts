
import { observable, action, reaction } from 'mobx'
import { resume } from '../../audio/context'
import { logger } from '../../../shared/logger'
import { DEFAULT_SHADER, shaderNames } from '../../containers/ShaderCanvas'

import { patternsStore, PatternsStore } from '../patternsStore'
import { startAnalysis, pauseAnalysis } from '../analysisStore'
import { errorString } from '../../../shared/errorHelpers'

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
          gtagPatched('event', 'exception', {
            description: 'Failed to acquire wake lock: ' + errorString(err),
            event_label: 'request wake lock exception',
          })
        })
      }
    } else {
      pauseAnalysis()
      if (renderStateStore.wakeLock) {
        renderStateStore.wakeLock.release().then(() => {
          renderStateStore.wakeLock = null
        }).catch(err => {
          logger.warn('failed to release wake lock', err)
          gtagPatched('event', 'exception', {
            description: 'Failed to release wake lock: ' + errorString(err),
            event_label: 'release wake lock exception',
          })
        })
      }
    }
  },
)

reaction(
  () => renderStateStore.shader,
  (shader) => {
    gtagPatched('event', 'set_visualization', {
      event_category: 'visualization',
      shader_id: shader,
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
        gtagPatched('event', 'exception', {
          description: 'Failed to exit fullscreen: ' + errorString(err),
          event_label: 'fullscreen exit exception',
        })
      })
    } else {
      renderState.isFullscreen = true
      document.body.requestFullscreen({
        navigationUI: 'hide',
      }).catch((err) => {
        logger.warn('Fullscreen not allowed by user.')
        gtagPatched('event', 'exception', {
          description: 'Failed to enter fullscreen: ' + errorString(err),
          event_label: 'fullscreen entry exception',
        })
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
    gtagPatched('event', 'exception', {
      description: 'Failed to resume color pattern: ' + errorString(e),
      event_label: 'color pattern resume exception',
      fatal: true,
    })
  })
})


import { action, observable, reaction } from 'mobx'

import { errorString } from '../../../shared/errorHelpers'
import { logger } from '../../../shared/logger'
import { startAudio, stopAudio } from '../../audio'
import { resume } from '../../audio/context'
import { ShaderName } from '../../containers/ShaderCanvas/shaderName'
import { analysisStore } from '../analysisStore'
import { patternsStore, PatternsStore } from '../patternsStore'

export type RenderStateStore = typeof renderStateStore

export interface RenderStateProp {
  renderState: RenderStateStore
}

export type ServiceWorkerState =
  | 'checking for capability'
  | 'not supported'
  | 'installing'
  | 'active'
  | 'failed'

export type PushSubscriptionState =
  | 'no service worker'
  | 'pending service worker'
  | 'awaiting request'
  | 'subscribed'
  | 'rejected'

const DEFAULT_SHADER = 'lights' as ShaderName
export const renderStateStore = observable({
  serviceWorkerState: 'checking for capability' as ServiceWorkerState,
  pushSubscriptionState: 'no service worker' as PushSubscriptionState,
  wakeLock: null as WakeLockSentinel | null,
  showText: true,
  showColors: false,
  isFullscreen: false,
  shader: DEFAULT_SHADER,
  shaderSliders: {} as {
    [name: string]: number | undefined
  },
  takeScreenshot: async () => { /* noop */ },
})

reaction(
  () => renderStateStore.showColors,
  async (show) => {
    if (show) {
      await startAudio()
      analysisStore.startAnalysis()
      if (navigator.wakeLock?.request) {
        navigator.wakeLock.request('screen').then(wakeLock => {
          renderStateStore.wakeLock = wakeLock
        }).catch(err => {
          logger.warn('failed to acquire wake lock', err)
          gtag('event', 'exception', {
            description: 'Failed to acquire wake lock: ' + errorString(err),
            event_label: 'request wake lock exception',
          })
        })
      }
    } else {
      analysisStore.pauseAnalysis()
      await stopAudio()
      if (renderStateStore.wakeLock) {
        renderStateStore.wakeLock.release().then(() => {
          renderStateStore.wakeLock = null
        }).catch(err => {
          logger.warn('failed to release wake lock', err)
          gtag('event', 'exception', {
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
    gtag('event', 'set_visualization', {
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
        gtag('event', 'exception', {
          description: 'Failed to exit fullscreen: ' + errorString(e),
          event_label: 'fullscreen exit exception',
        })
      })
    } else {
      renderState.isFullscreen = true
      document.body.requestFullscreen({
        navigationUI: 'hide',
      }).catch((err) => {
        logger.warn('Fullscreen not allowed by user.')
        gtag('event', 'exception', {
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
    gtag('event', 'exception', {
      description: 'Failed to resume color pattern: ' + errorString(e),
      event_label: 'color pattern resume exception',
      fatal: true,
    })
  })
})

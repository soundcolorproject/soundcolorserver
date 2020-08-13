
import { action, observable, reaction } from 'mobx'

import { errorString } from '../../../shared/errorHelpers'
import { logger } from '../../../shared/logger'
import { startAudio, stopAudio } from '../../audio'
import { resume } from '../../audio/context'
import { ShaderName } from '../../containers/ShaderCanvas/shaderName'
import { analysisStore } from '../analysisStore'
import { patternsStore, PatternsStore } from '../patternsStore'

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
export class RenderStateStore {
  constructor () {
    reaction(
      () => this.showColors,
      async (show) => {
        if (show) {
          await startAudio()
          analysisStore.startAnalysis()
          if (navigator.wakeLock?.request) {
            navigator.wakeLock.request('screen').then(wakeLock => {
              this.wakeLock = wakeLock
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
          if (this.wakeLock) {
            this.wakeLock.release().then(() => {
              this.wakeLock = null
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
      () => this.shader,
      (shader) => {
        gtag('event', 'set_visualization', {
          event_category: 'visualization',
          shader_id: shader,
        })
      },
    )

  }

  @observable serviceWorkerState: ServiceWorkerState = 'checking for capability'
  @observable pushSubscriptionState: PushSubscriptionState = 'no service worker'
  @observable wakeLock: WakeLockSentinel | null = null
  @observable showText = true
  @observable showColors = false
  @observable isFullscreen = false
  @observable shader = DEFAULT_SHADER
  @observable shaderSliders: Record<string, number | undefined> = {}
  @observable takeScreenshot: () => Promise<void> = async () => { /* noop */ }

  @action
  togglePattern (
    patterns: PatternsStore = patternsStore,
  ) {
    if (!patterns.currentPattern) {
      patterns.currentPattern = 'chakras'
    }
    this.showColors = !this.showColors
    resume().catch((e) => {
      logger.fatal('Could not resume color pattern:', e)
      gtag('event', 'exception', {
        description: 'Failed to resume color pattern: ' + errorString(e),
        event_label: 'color pattern resume exception',
        fatal: true,
      })
    })
  }

  @action
  startPattern (
    patterns: PatternsStore = patternsStore,
  ) {
    if (!this.showColors) {
      this.togglePattern(patterns)
    }
  }

  @action
  toggleFullscreen () {
    if (document.fullscreenEnabled) {
      if (document.fullscreenElement) {
        this.isFullscreen = false
        document.exitFullscreen().catch((e) => {
          logger.error('Could not exit fullscreen mode:', e)
          gtag('event', 'exception', {
            description: 'Failed to exit fullscreen: ' + errorString(e),
            event_label: 'fullscreen exit exception',
          })
        })
      } else {
        this.isFullscreen = true
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
  }
}

export const renderStateStore = new RenderStateStore()

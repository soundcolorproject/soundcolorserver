
import { errorString } from '../shared/errorHelpers'
import { logger } from '../shared/logger'

import { renderStateStore, toggleFullscreen, togglePattern } from './state/renderStateStore'

window.addEventListener('unhandledrejection', (evt) => {
  logger.error('Unhandled rejection:', evt.reason)
  gtag('event', 'exception', {
    description: errorString(evt.reason),
  })
})

window.addEventListener('error', (evt) => {
  logger.error('Uncaught exception', evt.error)
  gtag('event', 'exception', {
    description: errorString(evt.error),
  })
})

function shortcutsDisabled () {
  return location.pathname === '/'
}

export function registerGlobalHandlers () {
  if (!document) {
    return
  }

  document.body.addEventListener('fullscreenchange', () => {
    renderStateStore.isFullscreen = !!document.fullscreenElement
  })

  document.body.addEventListener('keypress', (ev) => {
    if (shortcutsDisabled()) return
    if (ev.key === ' ') {
      renderStateStore.showText = !renderStateStore.showText
    } else if (ev.key === 'Enter') {
      togglePattern()
    } else if (ev.key === 'f') {
      toggleFullscreen()
    }
  })
}

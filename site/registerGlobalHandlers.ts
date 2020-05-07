
import { renderStateStore, togglePattern, toggleFullscreen } from './state/renderStateStore'
import { logger } from '../shared/logger'

window.addEventListener('unhandledrejection', (evt) => {
  logger.error('Unhandled rejection:', evt.reason)
})

window.addEventListener('error', (evt) => {
  logger.error('Uncaught exception', evt.error)
})

function shortcutsDisabled () {
  return location.pathname.startsWith('/info')
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

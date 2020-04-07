
import { renderStateStore, togglePattern, toggleFullscreen } from './state/renderStateStore'

export function registerGlobalHandlers () {
  if (!document) {
    return
  }

  document.body.addEventListener('fullscreenchange', () => {
    renderStateStore.isFullscreen = !!document.fullscreenElement
  })

  document.body.addEventListener('keypress', (ev) => {
    if (ev.key === ' ') {
      renderStateStore.showText = !renderStateStore.showText
    } else if (ev.key === 'Enter') {
      togglePattern()
    } else if (ev.key === 'f') {
      toggleFullscreen()
    }
  })
}

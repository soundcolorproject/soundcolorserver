
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RenderStateProp, toggleFullscreen, togglePattern } from '../../state/renderStateStore'
import { PatternsProp } from '../../state/patternsStore'

import { shortcuts } from './shortcuts.pcss'
import { logger } from '../../../shared/logger'

interface OwnProps {
}

type StateProps = RenderStateProp & PatternsProp

export type ShortcutsProps = OwnProps & StateProps

const stopBubblingEnterAndSpace = (handler: () => void) => (ev: React.KeyboardEvent | React.MouseEvent) => {
  const key = (ev as React.KeyboardEvent).key
  if (key) {
    if (key === 'Enter' || key === ' ') {
      logger.debug('stopping propogation on keydown')
      ev.preventDefault()
      handler()
    }
  } else {
    handler()
  }
}

export const Shortcuts = injectAndObserve<StateProps, OwnProps>(
  ({ renderState, patterns }) => ({ renderState, patterns }),
  class Shortcuts extends React.Component<ShortcutsProps> {
    hideText = stopBubblingEnterAndSpace(() => {
      const { renderState } = this.props
      renderState.showText = !renderState.showText
    })

    togglePattern = stopBubblingEnterAndSpace(() => {
      const { renderState, patterns } = this.props
      togglePattern(patterns, renderState)
    })

    toggleFullscreen = stopBubblingEnterAndSpace(() => {
      toggleFullscreen(this.props.renderState)
    })

    render () {
      const { renderState } = this.props
      const changePatternText = renderState.showColors
        ? 'Stop'
        : 'Start'

      const fullscreenText = renderState.isFullscreen
        ? 'Leave'
        : 'Enter'

      return (
        <div id={shortcuts}>
          <div>
            <p><span>'space'</span> = show/hide details</p>
            <button
              type='button'
              role='button'
              aria-label='Hide page details'
              onClick={this.hideText}
              onKeyDown={this.hideText}
            >
              Hide Details
            </button>
          </div>
          <div>
            <p><span>'enter'</span> = stop/start color pattern</p>
            <button
              type='button'
              role='button'
              aria-label={`${changePatternText} the color pattern`}
              onClick={this.togglePattern}
              onKeyDown={this.togglePattern}
            >
              {changePatternText} Color Pattern
            </button>
          </div>
            {
              document.fullscreenEnabled
                ? <>
                    <p><span>'f'</span> = enter/leave fullscreen</p>
                    <button
                      type='button'
                      role='button'
                      aria-label={`${fullscreenText} fullscreen mode`}
                      onClick={this.toggleFullscreen}
                      onKeyDown={this.toggleFullscreen}
                    >
                      {fullscreenText} Fullscreen
                    </button>
                  </>
                : ''
            }
        </div>
      )
    }
  },
)

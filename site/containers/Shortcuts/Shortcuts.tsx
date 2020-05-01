
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { RenderStateProp, toggleFullscreen, togglePattern } from '../../state/renderStateStore'
import { PatternsProp } from '../../state/patternsStore'

import { shortcuts, iconButton } from './shortcuts.pcss'
import { logger } from '../../../shared/logger'
import { IconName, Icon } from '../../components/Icon'

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
    private renderIconButton = (icon: IconName, action: (ev: React.KeyboardEvent | React.MouseEvent) => void) => (
      <button
        className={iconButton}
        type='button'
        role='button'
        onClick={action}
        onKeyDown={action}
      >
        <Icon name={icon} />
      </button>
    )

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

      return (
        <div id={shortcuts}>
          {
            this.renderIconButton(
              renderState.showColors ? 'pause_circle' : 'play_circle',
              this.togglePattern,
            )
          }
          {
            this.renderIconButton('visibility_off', this.hideText)
          }
          {
            document.fullscreenEnabled
            && this.renderIconButton(
              renderState.isFullscreen ? 'minimize' : 'fullscreen',
              this.toggleFullscreen,
            )
          }
        </div>
      )
    }
  },
)

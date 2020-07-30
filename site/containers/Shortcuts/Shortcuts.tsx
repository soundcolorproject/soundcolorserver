
import * as React from 'react'
import { useObserver } from 'mobx-react'
import * as cn from 'classnames'
import { RenderStateProp, toggleFullscreen, togglePattern } from '../../state/renderStateStore'
import { PatternsProp } from '../../state/patternsStore'
import { logger } from '../../../shared/logger'
import { IconName, Icon } from '../../components/Icon'
import { useStores } from '../../state/useStores'

import { shortcuts, hidden, iconButton } from './shortcuts.pcss'

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

export function Shortcuts () {
  const { intro, renderState, patterns } = useStores()

  const renderIconButton = (icon: IconName, action: (ev: React.KeyboardEvent | React.MouseEvent) => void) => (
    <button
      className={iconButton}
      type='button'
      role='button'
      onClick={action}
      onKeyDown={action}
    >
      <Icon name={icon} size='xs' />
    </button>
  )

  const _hideText = stopBubblingEnterAndSpace(() => {
    renderState.showText = !renderState.showText
  })

  const _togglePattern = stopBubblingEnterAndSpace(() => {
    togglePattern(patterns, renderState)
  })

  const _toggleFullscreen = stopBubblingEnterAndSpace(() => {
    toggleFullscreen(renderState)
  })

  return useObserver(() => (
    <div id={shortcuts} className={cn({ [hidden]: !(intro.seenHowItWorks && intro.warningAccepted) })}>
      {
        renderIconButton(
          renderState.showColors ? 'pause_circle' : 'play_circle',
          _togglePattern,
        )
      }
      {
        renderIconButton('visibility_off', _hideText)
      }
      {
        !__FORCED_FULLSCREEN__ && document.fullscreenEnabled
        && renderIconButton(
          renderState.isFullscreen ? 'minimize' : 'fullscreen',
          _toggleFullscreen,
        )
      }
    </div>
  ))
}


import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { logger } from '../../../shared/logger'
import { Icon, IconName } from '../../components/Icon'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp, toggleFullscreen, togglePattern } from '../../state/renderStateStore'
import { useStores } from '../../state/useStores'

import { hidden, iconButton, shortcuts } from './shortcuts.pcss'

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

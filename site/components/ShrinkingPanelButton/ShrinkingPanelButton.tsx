
import * as React from 'react'
import * as classNames from 'classnames'
import { Icon, IconName, IconSize } from '../Icon'

import {
  shrinkingPanelButton,
  shrunk,
  activeStyle,
  hoverColor,
  buttonIcon,
  text,
} from './shrinkingPanelButton.pcss'

export interface Props {
  children: string
  icon: IconName
  iconSize?: IconSize
  endIcon?: IconName
  noBold?: boolean
  onClick?: () => void
  shrink?: boolean
  active?: boolean
  className?: string
  style?: React.CSSProperties
}

const noop = () => undefined
export function ShrinkingPanelButton (props: Props) {
  const {
    children,
    icon,
    iconSize = 'xs',
    endIcon = 'play',
    noBold = false,
    onClick = noop,
    shrink = false,
    active = false,
    className,
    style,
  } = props

  const cn = classNames(
    shrinkingPanelButton,
    { [shrunk]: shrink },
    { [activeStyle]: active },
    className,
  )

  const handleClick = React.useMemo(() => (ev: React.SyntheticEvent) => {
    ev.preventDefault()
    onClick()
  }, [onClick])

  const handleKeypress = React.useMemo(() => (ev: React.KeyboardEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    if (ev.key === ' ' || ev.key === 'Enter') {
      onClick()
    }
  }, [onClick])

  return (
    <div
      className={cn}
      style={style}
      data-testid='shrinking-panel-button'
      onClick={shrink ? handleClick : undefined}
      tabIndex={shrink ? 0 : undefined}
      onKeyPress={handleKeypress}
    >
      <div
        className={hoverColor}
        onClick={shrink ? undefined : handleClick}
        tabIndex={shrink ? undefined : 0}
        onKeyPress={handleKeypress}
      >
        <Icon size={iconSize} name={icon} className={buttonIcon} style={{ marginRight: 6 }} />
        <div className={text} style={{ fontWeight: noBold ? 'normal' : 'bold' }}>{children}</div>
        <Icon size='sm' name={endIcon} className={buttonIcon} />
      </div>
    </div>
  )
}

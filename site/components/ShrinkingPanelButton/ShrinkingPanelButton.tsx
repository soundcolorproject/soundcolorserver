
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
  href?: string
  newTab?: boolean
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
    onClick,
    href,
    newTab = false,
    iconSize = 'xs',
    endIcon = onClick ? 'play' : href ? 'launch' : undefined,
    noBold = false,
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

  const handleClick = React.useMemo(() => !onClick ? noop : (ev: React.SyntheticEvent) => {
    ev.preventDefault()
    onClick()
  }, [onClick])

  const handleKeypress = React.useMemo(() => !onClick ? noop : (ev: React.KeyboardEvent) => {
    if (ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault()
      ev.stopPropagation()
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
      onKeyDown={handleKeypress}
    >
      <a
        href={href}
        className={hoverColor}
        onClick={shrink ? undefined : handleClick}
        tabIndex={shrink ? undefined : 0}
        onKeyDown={handleKeypress}
        target={newTab ? '_blank' : undefined}
      >
        <Icon size={iconSize} name={icon} className={buttonIcon} style={{ marginRight: 6 }} />
        <div className={text} style={{ fontWeight: noBold ? 'normal' : 'bold' }}>{children}</div>
        {endIcon && <Icon size='sm' name={endIcon} className={buttonIcon} />}
      </a>
    </div>
  )
}

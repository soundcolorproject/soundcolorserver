
import * as React from 'react'
import * as classNames from 'classnames'
import { Icon, IconName } from '../Icon'

import {
  shrinkingPanelButton,
  shrunk,
  activeStyle,
  hoverColor,
  buttonIcon,
  text,
} from './shrinkingPanelButton.pcss'

interface Props {
  children: string
  icon: IconName
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

  const handleClick = React.useMemo(() => (ev: React.MouseEvent) => {
    ev.preventDefault()
    onClick()
  }, [onClick])

  return (
    <div
      className={cn}
      style={style}
      data-testid='shrinking-panel-button'
      onClick={shrink ? handleClick : undefined}
    >
      <div className={hoverColor} onClick={shrink ? undefined : handleClick}>
        <Icon size='xs' name={icon} className={buttonIcon} style={{ marginRight: 6 }} />
        <div className={text}>{children}</div>
        <Icon size='sm' name='play' className={buttonIcon} />
      </div>
    </div>
  )
}

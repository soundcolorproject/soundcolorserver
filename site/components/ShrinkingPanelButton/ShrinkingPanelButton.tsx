
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
  shrink?: boolean
  active?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ShrinkingPanelButton (props: Props) {
  const {
    icon,
    shrink = false,
    active = false,
    children,
    className,
    style,
  } = props

  const cn = classNames(
    shrinkingPanelButton,
    { [shrunk]: shrink },
    { [activeStyle]: active },
    className,
  )

  return (
    <div
      className={cn}
      style={style}
      data-testid='shrinking-panel-button'
    >
      <div className={hoverColor}>
        <Icon size='xs' name={icon} className={buttonIcon} style={{ marginRight: 6 }} />
        <div className={text}>{children}</div>
        <Icon size='sm' name='play' className={buttonIcon} />
      </div>
    </div>
  )
}

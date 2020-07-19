
import * as React from 'react'
import * as classNames from 'classnames'

import { getContrastingColor, darken } from '../../pcss-functions'
import { Icon, IconName } from '../Icon'

import {
  panelButton,
  hoverButton,
  text,
  suffixText,
  buttonIcon,
  hilight,
} from './panelButton.pcss'

export interface Props {
  children?: React.ReactNode
  suffix?: React.ReactNode
  onClick?: () => void
  href?: string
  endIcon?: IconName
  hoverColor?: string
  active?: boolean
  noBold?: boolean
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

interface CssVars {
  '--panel-button-hover-background'?: string
  '--panel-button-hover-color'?: string

  '--panel-button-active-background'?: string
  '--panel-button-active-color'?: string
}

const noop = () => undefined
export function PanelButton (props: Props) {
  const {
    children,
    suffix,
    onClick,
    href,
    endIcon,
    hoverColor,
    active = false,
    noBold = false,
    className,
    style,
    'data-testid': testid = 'panel-button',
  } = props

  const cn = classNames(
    panelButton,
    className,
  )

  const fullStyle: React.CSSProperties & CssVars = {
    ...style,
  }

  if (hoverColor) {
    const hoverTextColor = getContrastingColor(hoverColor)
    fullStyle['--panel-button-hover-background'] = hoverColor
    fullStyle['--panel-button-hover-color'] = hoverTextColor

    const activeColor = darken(hoverColor, 0.2)
    const activeTextColor = getContrastingColor(activeColor)
    fullStyle['--panel-button-active-background'] = activeColor.toString()
    fullStyle['--panel-button-active-color'] = activeTextColor
  }

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
      style={fullStyle}
      data-testid={testid}
    >
      <a
        href={href}
        className={classNames(hoverButton, { [hilight]: active })}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={handleKeypress}
        target='_blank'
      >
        <div className={text} style={{ fontWeight: noBold ? 'normal' : 'bold' }}>
          {children}
          {suffix !== undefined && <span className={suffixText}> - {suffix}</span>}
        </div>
        {endIcon && <Icon size='sm' name={endIcon} className={buttonIcon} />}
      </a>
    </div>
  )
}


import * as classNames from 'classnames'
import * as React from 'react'

import { darken, getContrastingColor } from '../../pcss-functions'
import { SubRoute } from '../../state/routingStore'
import { useStores } from '../../state/useStores'
import { renderSlimButton, SlimButtonProps } from '../Button'
import { Icon, IconName } from '../Icon'

import {
  buttonIcon,
  disabledButton,
  hilight,
  hoverButton,
  panelButton,
  suffixText,
  text,
} from './panelButton.pcss'

export interface Props {
  children?: React.ReactNode
  suffix?: React.ReactNode
  onClick?: () => void
  href?: string
  newTab?: boolean
  toRoute?: SubRoute
  endIcon?: IconName
  endButton?: SlimButtonProps
  hoverColor?: string
  noActiveColor?: boolean
  active?: boolean
  disabled?: boolean
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
    newTab = false,
    toRoute,
    endIcon = toRoute ? 'play' : href ? 'launch' : undefined,
    endButton,
    hoverColor,
    noActiveColor,
    active = false,
    disabled = false,
    noBold = false,
    className,
    style,
    'data-testid': testid = 'panel-button',
  } = props

  const { routing } = useStores()

  const cn = classNames(
    panelButton,
    className,
  )

  const fullStyle: React.CSSProperties & CssVars = {
    ...style,
  }

  if (hoverColor) {
    if (noActiveColor) {
      fullStyle['--panel-button-hover-background'] = hoverColor
      fullStyle['--panel-button-hover-color'] = 'var(--white)'
      fullStyle['--panel-button-active-background'] = hoverColor
      fullStyle['--panel-button-active-color'] = 'var(--white)'
    } else {
      const hoverTextColor = getContrastingColor(hoverColor)
      fullStyle['--panel-button-hover-background'] = hoverColor
      fullStyle['--panel-button-hover-color'] = hoverTextColor

      const activeColor = darken(hoverColor, 0.2)
      const activeTextColor = getContrastingColor(activeColor)
      fullStyle['--panel-button-active-background'] = activeColor.toString()
      fullStyle['--panel-button-active-color'] = activeTextColor
    }
  }

  const skipHandling = (ev: React.SyntheticEvent) => (
    disabled || ev.currentTarget !== ev.target && (ev.target as HTMLElement).tagName === 'BUTTON'
  )

  const handleClick = React.useMemo(() => (ev: React.SyntheticEvent) => {
    if (skipHandling(ev)) {
      return
    }

    if (onClick) {
      ev.preventDefault()
      onClick()
    }

    if (toRoute) {
      ev.preventDefault()
      routing.goToSubroute(toRoute)
    }
  }, [onClick, toRoute])

  const handleKeypress = React.useMemo(() => !onClick ? noop : (ev: React.KeyboardEvent) => {
    if (skipHandling(ev)) {
      return
    }

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
        className={classNames(hoverButton, { [hilight]: active, [disabledButton]: disabled })}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={handleKeypress}
        target={newTab ? '_blank' : undefined}
      >
        <span className={text} style={{ fontWeight: noBold ? 'normal' : 'bold' }}>
          {children}
          {suffix !== undefined && <span className={suffixText}> - {suffix}</span>}
        </span>
        {endIcon && <Icon size='sm' name={endIcon} className={buttonIcon} />}
        {endButton && renderSlimButton({ ...endButton, preventDefault: true })}
      </a>
    </div>
  )
}

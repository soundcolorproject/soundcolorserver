
import * as React from 'react'
import * as classNames from 'classnames'

import { IconName, Icon } from '../Icon'

import { button, iconBeforeText } from './button.pcss'
import { Color, getContrastingColor, darken, lighten } from '../../pcss-functions'

export interface SlimButtonProps {
  text: string
  onClick: () => void
  className?: string
  color?: string
  hoverColor?: string
  preventDefault?: boolean
}

export interface ButtonProps {
  preIcon?: IconName
  onClick?: () => void
  children?: React.ReactNode
  forceLightText?: boolean
  forceDarkText?: boolean
  type?: 'button' | 'submit'
  color?: Color
  hoverColor?: Color
  preventDefault?: boolean
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

interface CssVars {
  '--button-background'?: string
  '--button-color'?: string
  '--button-hover-background'?: string
  '--button-hover-color'?: string
  '--button-active-background'?: string
  '--button-active-color'?: string
}

export function renderSlimButton ({ text, ...remainingProps }: SlimButtonProps) {
  return <Button {...remainingProps}>{text}</Button>
}

const WHITE = 'var(--white)'
const BLACK = 'var(--black)'
export function Button (props: ButtonProps) {
  const {
    preIcon,
    onClick,
    children,
    forceLightText,
    forceDarkText,
    type = 'button',
    color,
    hoverColor,
    preventDefault = type !== 'submit',
    className,
    style,
    'data-testid': testid = 'button',
  } = props

  const handleClick = React.useCallback((ev: React.MouseEvent) => {
    if (preventDefault) {
      ev.preventDefault()
    }

    onClick && onClick()
  }, [onClick, preventDefault])

  const fullStyle: React.CSSProperties & CssVars = {
    ...style,
  }

  if (color) {
    const contrastingColor = forceLightText ? WHITE : forceDarkText ? WHITE : getContrastingColor(color)
    fullStyle['--button-background'] = color.toString()
    fullStyle['--button-color'] = contrastingColor

    if (!hoverColor) {
      const hoverColor = contrastingColor === '#fff' || contrastingColor === 'var(--white)'
      ? darken(color, 0.4)
      : lighten(color, 0.4)
      const activeColor = contrastingColor === '#fff' || contrastingColor === 'var(--white)'
      ? darken(color, 0.6)
      : lighten(color, 0.6)

      fullStyle['--button-hover-background'] = hoverColor.toString()
      fullStyle['--button-hover-color'] = getContrastingColor(hoverColor)
      fullStyle['--button-active-background'] = activeColor.toString()
      fullStyle['--button-active-color'] = getContrastingColor(activeColor)
    }
  }

  if (hoverColor) {
    const contrastingColor = getContrastingColor(hoverColor)
    fullStyle['--button-hover-background'] = hoverColor.toString()
    fullStyle['--button-hover-color'] = contrastingColor

    const activeColor = contrastingColor === '#fff' || contrastingColor === 'var(--white)'
      ? lighten(hoverColor, 0.2)
      : darken(hoverColor, 0.2)

    fullStyle['--button-active-background'] = activeColor.toString()
    fullStyle['--button-active-color'] = getContrastingColor(activeColor)
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={classNames(button, className)}
      style={fullStyle}
      data-testid={testid}
    >
      {preIcon && <Icon size='xxs' name={preIcon} className={iconBeforeText} />}
      {children}
    </button>
  )
}

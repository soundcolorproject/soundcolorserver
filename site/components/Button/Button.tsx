
import * as React from 'react'
import * as classNames from 'classnames'

import { button } from './button.pcss'
import { Color, getContrastingColor, darken, lighten } from '../../pcss-functions'

interface Props {
  onClick?: () => void
  children?: React.ReactNode
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

export function Button (props: Props) {
  const {
    onClick,
    children,
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
    const contrastingColor = getContrastingColor(color)
    fullStyle['--button-background'] = color.toString()
    fullStyle['--button-color'] = contrastingColor

    if (!hoverColor) {
      const hoverColor = contrastingColor === '#fff' || contrastingColor === 'var(--white)'
      ? lighten(color, 0.2)
      : darken(color, 0.2)
      const activeColor = contrastingColor === '#fff' || contrastingColor === 'var(--white)'
      ? lighten(color, 0.4)
      : darken(color, 0.4)

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
      {children}
    </button>
  )
}

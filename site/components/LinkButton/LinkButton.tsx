
import { Link } from '@reach/router'
import * as React from 'react'

import { darken, getContrastingColor, lighten } from '../../pcss-functions'
import { Color } from '../../pcss-functions/types'

import { linkButton } from './linkButton.pcss'

export interface LinkButtonProps {
  color?: Color
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void
  'data-testid'?: string
}

interface CssVariables {
  '--normal-background'?: string
  '--hover-background'?: string
  '--active-background'?: string
}

export function LinkButton (props: LinkButtonProps) {
  const {
    color,
    to,
    children,
    className,
    style: customStyle,
    onClick,
    'data-testid': testid = 'link-button',
  } = props
  const style: React.CSSProperties & CssVariables = { ...customStyle }

  if (color) {
    const contrastingColor = getContrastingColor(color)
    style.color = contrastingColor
    style['--normal-background'] = color.toString()

    if (contrastingColor === '#000' || contrastingColor === 'var(--black)') {
      style['--hover-background'] = darken(color, 0.2).toString()
      style['--active-background'] = darken(color, 0.4).toString()
    } else {
      style['--hover-background'] = lighten(color, 0.2).toString()
      style['--active-background'] = lighten(color, 0.4).toString()
    }
  }

  return (
    <Link
      to={to}
      className={`${linkButton} ${className}`}
      onClick={onClick}
      style={style}
      data-testid={testid}
    >
      {children}
    </Link>
  )
}


import * as React from 'react'
import { Link } from '@reach/router'

import { getContrastingColor } from '../../../../pcss-functions'

import { linkButton } from './linkButton.pcss'
import { Color } from '../../../../pcss-functions/types'

export interface LinkButtonProps {
  color?: Color
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void
}

export function LinkButton ({ color, to, children, className, style: customStyle, onClick }: LinkButtonProps) {
  const style: React.CSSProperties = { ...customStyle }

  if (color) {
    style.backgroundColor = color.toString()
    style.color = getContrastingColor(color)
  }

  // TODO: Update hover/active styles
  return (
    <Link to={to} className={`${linkButton} ${className}`} onClick={onClick} style={style}>{children}</Link>
  )
}

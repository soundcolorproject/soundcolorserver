
import * as React from 'react'
import { Link } from '@reach/router'

import { getContrastingColor } from '../../../../pcss-functions'

import { linkButton } from './linkButton.pcss'

export interface LinkButtonProps {
  color?: string
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function LinkButton ({ color, to, children, className, style: customStyle }: LinkButtonProps) {
  const style: React.CSSProperties = { ...customStyle }

  if (color) {
    style.backgroundColor = color
    style.color = getContrastingColor(color)
  }

  return (
    <Link to={to} className={`${linkButton} ${className}`} style={style}>{children}</Link>
  )
}

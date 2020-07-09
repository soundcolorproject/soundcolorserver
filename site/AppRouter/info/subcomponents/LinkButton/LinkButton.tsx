
import * as React from 'react'
import { Link } from '@reach/router'

import { getContrastingColor } from '../../../../pcss-functions'

import { linkButton } from './linkButton.pcss'
import { Color } from '../../../../pcss-functions/types'
import { lighten } from '../../../../pcss-functions/lighten'

export interface LinkButtonProps {
  color?: Color
  to: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void
}

interface CssVariables {
  '--normal-background'?: string
  '--hover-background'?: string
}

export function LinkButton ({ color, to, children, className, style: customStyle, onClick }: LinkButtonProps) {
  const style: React.CSSProperties & CssVariables = { ...customStyle }
  // const ref = React.useRef<HTMLAnchorElement>(null)
  // React.useLayoutEffect(() => {
  //   if (ref.current) {
  //     ref.current.style.set
  //   }
  // }, [ref.current])

  if (color) {
    style.color = getContrastingColor(color)
    style['--normal-background'] = color.toString()
    style['--hover-background'] = lighten(color, 0.2).toString()
  }

  return (
    <Link to={to} className={`${linkButton} ${className}`} onClick={onClick} style={style}>{children}</Link>
  )
}

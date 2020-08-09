
import * as classNames from 'classnames'
import * as React from 'react'

import { hidden, shrinkingSidePanel, shrunk } from './shrinkingSidePanel.pcss'

interface Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  shrink?: boolean
  hide?: boolean
}

export function ShrinkingSidePanel (props: Props) {
  const { children, className, style, shrink = false, hide = false } = props

  return (
    <div
      className={classNames(shrinkingSidePanel, { [shrunk]: shrink, [hidden]: hide }, className)}
      style={style}
      data-testid='shrinking-side-panel'
    >
      {children}
    </div>
  )
}

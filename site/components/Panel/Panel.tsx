
import * as React from 'react'
import * as classNames from 'classnames'

import { panel, panelTitle } from './panel.pcss'

interface Props {
  title: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Panel (props: Props) {
  const { title, children, className, style } = props

  return (
    <div
      className={classNames(panel, className)}
      style={style}
      data-testid='panel'
    >
      <div className={panelTitle}>{title}</div>
      {children}
    </div>
  )
}

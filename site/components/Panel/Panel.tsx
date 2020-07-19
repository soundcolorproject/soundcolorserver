
import * as React from 'react'
import * as classNames from 'classnames'

import { panel, panelTitle } from './panel.pcss'

interface Props {
  title: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export function Panel (props: Props) {
  const { title, children, className, style, 'data-testid': testid = 'panel' } = props

  return (
    <div
      className={classNames(panel, className)}
      style={style}
      data-testid={testid}
    >
      <div className={panelTitle}>{title}</div>
      {children}
    </div>
  )
}

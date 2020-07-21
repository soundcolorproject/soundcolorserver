
import * as React from 'react'
import * as classNames from 'classnames'

import { panelDetail } from './panelDetail.pcss'

interface Props {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export function PanelDetail (props: Props) {
  const {
    children,
    className,
    style,
    'data-testid': testid = 'panel-detail',
  } = props

  return (
    <div
      className={classNames(panelDetail, className)}
      style={style}
      data-testid={testid}
    >
      {children}
    </div>
  )
}

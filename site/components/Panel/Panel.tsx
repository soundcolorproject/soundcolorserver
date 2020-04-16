
import * as React from 'react'

import { panel } from './panel.pcss'

export interface PanelProps {
  width?: number
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function Panel ({ width, style, children }: PanelProps) {
  return (
    <div className={panel} style={{ ...style, width }}>
      {children}
    </div>
  )
}

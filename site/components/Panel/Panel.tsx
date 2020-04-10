
import * as React from 'react'

import { panel } from './panel.pcss'

export interface PanelProps {
  width?: number
  style?: React.CSSProperties
}

export function Panel ({ width, style }: PanelProps) {
  return (
    <div className={panel}></div>
  )
}

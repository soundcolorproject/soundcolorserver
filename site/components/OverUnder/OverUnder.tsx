
import * as React from 'react'

import { overUnder, over, under } from './overUnder.pcss'

export interface OverUnderProps {
  over: React.ReactElement | string
  under: React.ReactElement | string
}

export function OverUnder (props: OverUnderProps) {
  return (
    <div className={overUnder}>
      <div className={over}>{props.over}</div>
      <div className={under}>{props.under}</div>
    </div>
  )
}

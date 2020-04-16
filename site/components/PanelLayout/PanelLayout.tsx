
import * as React from 'react'

import {
  panelLayout,
  layoutColumn,
  layoutSpacer,
  afterSpacer,
} from './panelLayout.pcss'

export interface PanelLayoutProps {
  preSpacer: React.ReactElement
  inSpacer?: React.ReactElement
  postSpacer: React.ReactElement
}

export function PanelLayout (props: PanelLayoutProps) {
  const { preSpacer, inSpacer, postSpacer } = props
  return (
    <div className={panelLayout}>
      <div className={layoutColumn}>
        {preSpacer}
        <div className={layoutSpacer}>{inSpacer}</div>
        <div className={afterSpacer}>
          {postSpacer}
        </div>
      </div>
    </div>
  )
}

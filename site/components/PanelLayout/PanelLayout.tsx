
import * as React from 'react'

import {
  panelLayout,
  layoutColumn,
  layoutSpacer,
  afterSpacer,
} from './panelLayout.pcss'

export interface PanelLayoutProps {
  preSpacer: React.ReactElement
  postSpacer: React.ReactElement
}

export function PanelLayout (props: PanelLayoutProps) {
  const { preSpacer, postSpacer } = props
  return (
    <div className={panelLayout}>
      <div className={layoutColumn}>
        {preSpacer}
        <div className={layoutSpacer} />
        <div className={afterSpacer}>
          {postSpacer}
        </div>
      </div>
    </div>
  )
}

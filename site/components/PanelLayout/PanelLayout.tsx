
import * as React from 'react'

import {
  panelLayout,
  layoutColumn,
  layoutSpacer,
  afterSpacer,
  layoutFooter,
} from './panelLayout.pcss'

export interface PanelLayoutProps {
  preSpacer: React.ReactElement
  inSpacer?: React.ReactElement
  postSpacer: React.ReactElement
  footer: React.ReactElement
}

export function PanelLayout (props: PanelLayoutProps) {
  const { preSpacer, inSpacer, postSpacer, footer } = props
  return (
    <div className={panelLayout}>
      <div className={layoutColumn}>
        {preSpacer}
        <div className={layoutSpacer}>{inSpacer}</div>
        <div className={afterSpacer}>
          {postSpacer}
        </div>
        <div className={layoutFooter}>
          {footer}
        </div>
      </div>
    </div>
  )
}

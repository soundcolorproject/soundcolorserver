
import * as React from 'react'

import {
  panelLayout,
  layoutColumn,
  layoutSpacer,
  afterSpacer,
  layoutFooter,
} from './panelLayout.pcss'

export interface PanelLayoutProps {
  above?: React.ReactElement
  preSpacer: React.ReactElement
  inSpacer?: React.ReactElement
  postSpacer: React.ReactElement
  footer: React.ReactElement
}

export function PanelLayout (props: PanelLayoutProps) {
  const { above, preSpacer, inSpacer, postSpacer, footer } = props
  return (
    <div className={panelLayout}>
      <div className={layoutColumn}>
        <div className='gt-mobile grow center'>{above}</div>
        {preSpacer}
        <div className={layoutSpacer}>
          {inSpacer}
          <div className='lt-mobile grow center'>{above}</div>
        </div>
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

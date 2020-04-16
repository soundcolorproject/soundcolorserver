
import * as React from 'react'
import * as cn from 'classnames'

import { useTransition } from '../../hooks/useTransition'

import {
  panelLayout,
  layoutColumn,
  layoutSpacer,
  afterSpacer,
  swapper,
  prev,
  next,
  transition,
  transitionBack,
} from './panelLayout.pcss'
import { useHeight } from '../../hooks/useHeight'

export interface PanelLayoutProps {
  preSpacer: React.ReactElement
  postSpacer: React.ReactElement
  back?: boolean
}

export function PanelLayout (props: PanelLayoutProps) {
  const { preSpacer, postSpacer, back } = props
  const [prevPostSpacer, shouldTransition] = useTransition(postSpacer)
  const height = useHeight(postSpacer, 0)

  if (!prevPostSpacer) {
    return (
      <div className={panelLayout}>
        <div className={layoutColumn}>
          {preSpacer}
          <div className={layoutSpacer} />
          <div className={afterSpacer}>
            <div className={swapper} style={{ height }}>
              <div className={prev}>
                {postSpacer}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={panelLayout}>
      <div className={layoutColumn}>
        {preSpacer}
        <div className={layoutSpacer} />
        <div className={afterSpacer}>
          <div className={cn({
            [swapper]: true,
            [transition]: shouldTransition && !back,
            [transitionBack]: shouldTransition && back,
          })} style={{ height }}>
            <div className={prev}>
              {prevPostSpacer}
            </div>
            <div className={next}>
              {postSpacer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

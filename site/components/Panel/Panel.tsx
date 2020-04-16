
import * as React from 'react'
import * as cn from 'classnames'

import { useTransition } from '../../hooks/useTransition'
import { useHeight } from '../../hooks/useHeight'

import {
  panel,
  swapper,
  prev,
  next,
  transition,
  transitionBack,
} from './panel.pcss'

export interface PanelProps {
  back?: boolean
  children: React.ReactElement
}

export function Panel ({ back, children }: PanelProps) {
  const ownRef = React.useRef<HTMLDivElement>(null)
  const [prevChildren, shouldTransition] = useTransition(children, 1000)
  const width = ownRef.current
    ? ownRef.current.clientWidth - 48
    : window.innerWidth - 48
  const height = useHeight(children, width, 0) + 48
  if (!prevChildren) {
    return (
      <div ref={ownRef} className={panel}>
        <div className={swapper} style={{ height }}>
          <div className={prev}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ownRef} className={panel}>
      <div className={cn({
        [swapper]: true,
        [transition]: shouldTransition && !back,
        [transitionBack]: shouldTransition && back,
      })} style={{ height }}>
        <div className={prev}>
          {prevChildren}
        </div>
        <div className={next}>
          {children}
        </div>
      </div>
    </div>
  )
}

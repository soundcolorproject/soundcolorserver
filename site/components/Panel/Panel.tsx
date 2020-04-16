
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
import { MobxProvider } from '../../state/MobxProvider'

export interface PanelProps {
  children: React.ReactElement
  back?: boolean
  className?: string
  style?: React.CSSProperties
  transitionSpeed?: number
  recompute?: any
}

export function Panel (props: PanelProps) {
  const { children, back, className, style, transitionSpeed = 500 } = props
  const ownRef = React.useRef<HTMLDivElement>(null)
  if (ownRef.current && props.transitionSpeed !== undefined) {
    ownRef.current.style.setProperty('--panel-transition-time', `${(transitionSpeed / 1000).toFixed(2)}s`)
  }
  const [prevChildren, shouldTransition] = useTransition(children, transitionSpeed + 200)
  const width = ownRef.current
    ? ownRef.current.clientWidth - 48
    : window.innerWidth - 48
  // const height = useHeight(<MobxProvider>{children}</MobxProvider>, width, 0) + 48
  const height = useHeight(children, width, 0) + 48
  if (!prevChildren) {
    return (
      <div ref={ownRef} className={cn(panel, className)} style={style}>
        <div className={swapper} style={{ height }}>
          <div className={prev}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ownRef} className={cn(panel, className)} style={style}>
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

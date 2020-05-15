
import * as React from 'react'
import * as cn from 'classnames'
// import useDimensions from 'react-use-dimensions'

import { useTransition } from '../../hooks/useTransition'
import { useDimensions } from '../../hooks/useDimensions'

import {
  panel,
  swapper,
  scrollable,
  current,
  prev,
  next,
  transition,
  transitionBack,
} from './panel.pcss'

export interface PanelProps {
  children: React.ReactElement
  back?: boolean
  className?: string
  style?: React.CSSProperties
  transitionSpeed?: number
  recompute?: any
}

export function Panel (props: PanelProps) {
  const { children, back, className, style, recompute, transitionSpeed = 750 } = props
  const [prevChildren, shouldTransition] = useTransition(children, transitionSpeed + 200)

  const [ref, dimensions] = useDimensions<HTMLDivElement>(recompute)
  const height = dimensions?.height

  if (!prevChildren) {
    return (
      <div className={cn(panel, className)} style={style}>
        <div className={swapper} style={{ height }}>
          <div className={`${scrollable} ${current}`}>
            <div key='current' ref={ref}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(panel, className)} style={style}>
      <div className={cn({
        [swapper]: true,
        [transition]: shouldTransition && !back,
        [transitionBack]: shouldTransition && back,
      })} style={{ height }}>
        <div className={`${scrollable} ${prev}`}>
          <div key='prev'>
            {prevChildren}
          </div>
        </div>
        <div className={`${scrollable} ${next}`}>
          <div ref={ref} key={`next-${recompute}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

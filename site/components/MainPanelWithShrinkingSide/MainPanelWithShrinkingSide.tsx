
import * as React from 'react'
import * as cn from 'classnames'

import {
  mainPanelWithShrinkingSide,
  panelContentWrapper,
  panelContent,
  swapper,
  transitionRight,
  transitionLeft,
  transitionUp,
  transitionDown,
  prev,
  next,
  current,
} from './mainPanelWithShrinkingSide.pcss'
import { useTransition } from '../../hooks/useTransition'
import { logger } from '../../../shared/logger'

export type TransitionDirection = 'up' | 'down' | 'left' | 'right'

export interface Props {
  sidePanel: React.ReactElement
  children: React.ReactElement | null
  height: number
  transitionDirection: TransitionDirection
  open: boolean
  className?: string
  style?: React.CSSProperties
}

export function MainPanelWithShrinkingSide (props: Props) {
  const {
    sidePanel,
    children,
    height,
    transitionDirection,
    open,
    className,
    style,
  } = props

  const [prevChildren, shouldTransition] = useTransition(children, 400)

  if (!prevChildren) {
    return (
      <div
        className={cn(mainPanelWithShrinkingSide, className)}
        style={{ ...style, height }}
        data-testid='main-panel-with-shrinking-side'
      >
        {sidePanel}
        <div className={panelContentWrapper}>
          <div className={swapper}>
            <div className={cn(panelContent, current)} style={{ width: open ? undefined : 0 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  let transitionClass: string
  switch (transitionDirection) {
    case 'right':
      transitionClass = transitionRight
      break
    case 'left':
      transitionClass = transitionLeft
      break
    case 'up':
      transitionClass = transitionUp
      break
    case 'down':
      transitionClass = transitionDown
      break
  }

  return (
    <div
      className={cn(mainPanelWithShrinkingSide, className)}
      style={{ ...style, height }}
      data-testid='main-panel-with-shrinking-side'
    >
      {sidePanel}
      <div className={panelContentWrapper} style={{ width: open ? undefined : 0 }}>
        <div className={cn(
          swapper,
          { [transitionClass]: shouldTransition },
        )}>
          <div className={cn(panelContent, prev)}>
            {prevChildren}
          </div>
          <div className={cn(panelContent, next)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

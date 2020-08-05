
import * as cn from 'classnames'
import * as React from 'react'

import { useTransition } from '../../hooks/useTransition'

import {
  current,
  mainPanelWithShrinkingSide,
  next,
  panelContent,
  panelContentWrapper,
  prev,
  swapper,
  transitionDown,
  transitionLeft,
  transitionNone,
  transitionRight,
  transitionUp,
} from './mainPanelWithShrinkingSide.pcss'

export type TransitionDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface Props {
  prePanel?: React.ReactNode
  sidePanel: React.ReactElement
  children: React.ReactElement | null
  overtop?: React.ReactNode
  onlyOvertop?: boolean
  height: number
  transitionDirection: TransitionDirection
  open: boolean
  className?: string
  style?: React.CSSProperties
}

export function MainPanelWithShrinkingSide (props: Props) {
  const {
    prePanel,
    sidePanel,
    children,
    overtop,
    onlyOvertop = false,
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
        {prePanel}
        {
          !onlyOvertop && <>
            {sidePanel}
            <div className={panelContentWrapper}>
              <div className={swapper}>
                <div className={cn(panelContent, current)} style={{ width: open ? undefined : 0 }}>
                  {children}
                </div>
              </div>
            </div>
          </>
        }
        {overtop}
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
    case 'none':
    default:
      transitionClass = transitionNone
      break
  }

  return (
    <div
      className={cn(mainPanelWithShrinkingSide, className)}
      style={{ ...style, height }}
      data-testid='main-panel-with-shrinking-side'
    >
      {prePanel}
      {
        !onlyOvertop && <>
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
        </>
      }
      {overtop}
    </div>
  )
}

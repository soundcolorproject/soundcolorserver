
import * as classNames from 'classnames'
import * as React from 'react'

import { renderSlimButton, SlimButtonProps } from '../Button'

import { panel, panelContent, panelTitle, titleButton, titleText } from './panel.pcss'

interface Props {
  title: string
  button?: SlimButtonProps
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export function Panel (props: Props) {
  const {
    title,
    button,
    children,
    className,
    style,
    'data-testid': testid = 'panel',
  } = props

  return (
    <div
      className={classNames(panel, className)}
      style={style}
      data-testid={testid}
    >
      <div className={panelTitle}>
        <div className={titleText}>{title}</div>
        {button && renderSlimButton({ ...button, className: titleButton })}
      </div>
      <div className={panelContent}>
        {children}
      </div>
    </div>
  )
}

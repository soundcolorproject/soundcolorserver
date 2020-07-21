
import * as React from 'react'
import * as classNames from 'classnames'

import { panel, panelTitle, titleText, titleButton } from './panel.pcss'
import { SlimButtonProps, renderSlimButton } from '../Button'

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
      {children}
    </div>
  )
}

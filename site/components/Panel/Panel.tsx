
import * as React from 'react'
import * as classNames from 'classnames'

import { panel, panelTitle, titleText, titleButton } from './panel.pcss'
import { Button } from '../Button'

interface Props {
  title: string
  button?: {
    text: string
    onClick: () => void
    color?: string
    hoverColor?: string
  }
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
        {
          button &&
            <Button
              className={titleButton}
              onClick={button.onClick}
              color={button.color}
              hoverColor={button.hoverColor}
            >
              {button.text}
            </Button>
        }
      </div>
      {children}
    </div>
  )
}

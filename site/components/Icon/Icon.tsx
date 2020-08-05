
import * as cn from 'classnames'
import * as React from 'react'

import { icon } from './icon.pcss'
import { IconName, iconOptions, iconProperties, IconProperties, IconSize, iconSizes, IconViewBox } from './iconOptions'

export interface IconProps {
  name: IconName
  color?: string
  size?: IconSize
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

function defaultSizeDetails (size: IconSize): IconProperties {
  return ({
    fullWidth: iconSizes[size],
    fullHeight: iconSizes[size],
    marginWidth: 0,
    marginHeight: 0,
  })
}

const defautViewBox: IconViewBox = {
  viewWidth: 24,
  viewHeight: 24,
}

export function Icon (props: IconProps) {
  const {
    name,
    color,
    size = 'med',
    className,
    style,
    'data-testid': testid = 'icon',
  } = props
  const properties = iconProperties[name]
  const sizeDetails = properties && properties[size] || defaultSizeDetails(size)
  const viewBox = properties || defautViewBox

  return (
    <svg
      className={cn(icon, className)}
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`0 0 ${viewBox.viewWidth} ${viewBox.viewHeight}`}
      fill={color}
      width={sizeDetails.fullWidth}
      height={sizeDetails.fullHeight}
      style={{
        marginTop: -sizeDetails.marginHeight || undefined,
        marginBottom: -sizeDetails.marginHeight || undefined,
        marginLeft: sizeDetails.marginWidth ? `calc(var(--pre-icon-padding) - ${sizeDetails.marginWidth}px)` : undefined,
        marginRight: sizeDetails.marginWidth ? `calc(var(--post-icon-padding) - ${sizeDetails.marginWidth}px)` : undefined,
        ...style,
      }}
      data-testid={testid}
    >
      <use href={iconOptions[name]} fill={color} data-testid={`${testid}-use-statement`} />
    </svg>
  )
}


import * as React from 'react'
import * as cn from 'classnames'

import { icon } from './icon.pcss'

import { IconSize, IconName, iconSizes, iconOptions, iconProperties, IconProperties, IconViewBox } from './iconOptions'

export interface IconProps {
  name: IconName
  color?: string
  size?: IconSize
  className?: string
  style?: React.CSSProperties
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

export function Icon ({ name, color, size = 'med', className, style }: IconProps) {
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
        marginLeft: -sizeDetails.marginWidth || undefined,
        marginRight: -sizeDetails.marginWidth || undefined,
        ...style,
      }}
    >
      <use href={iconOptions[name]} fill={color} />
    </svg>
  )
}

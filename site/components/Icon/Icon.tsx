
import * as React from 'react'
import * as cn from 'classnames'

import { icon } from './icon.pcss'

import { IconName, iconOptions } from './iconOptions'

export type IconSize = keyof typeof iconSizes

export const iconSizes = {
  xxs: 12,
  xs: 16,
  sm: 20,
  med: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
}

export interface IconProps {
  name: IconName
  color?: string
  size?: IconSize
  className?: string
  style?: React.CSSProperties
}

export function Icon ({ name, color, size = 'med', className, style }: IconProps) {
  return (
    <svg
      className={cn(icon, className)}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill={color}
      width={iconSizes[size]}
      height={iconSizes[size]}
      style={style}
    >
      <use href={iconOptions[name]} fill={color} />
    </svg>
  )
}

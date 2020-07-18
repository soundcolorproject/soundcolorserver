
import * as React from 'react'

import icon from './icon-circle-small.png'

import { iconImage } from './logo.pcss'

export function Logo ({ className }: { className?: string }) {
  return <img src={icon} className={`${iconImage} ${className}`} />
}

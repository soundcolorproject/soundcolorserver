
import * as React from 'react'

import { patreonLink, icon } from './patreonLink.pcss'
import { Icon } from '../Icon'

export interface PatreonLinkProps {
  className?: string
}

export function PatreonLink ({ className }: PatreonLinkProps) {
  return (
    <a className={`${patreonLink} ${className}`} href='https://www.patreon.com/soundcolorproject' target='_blank'>
      <Icon name='patreon' size='xs' className={icon} />
      Become a Patron
    </a>
  )
}

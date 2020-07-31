
import * as React from 'react'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { shareLink, hidden } from './shareLink.pcss'

interface Navigator {

}

export interface ShareLinkProps extends RouteComponentProps {
  'data-testid'?: string
}

export const ShareLink: React.FunctionComponent<ShareLinkProps> = function ShareLink (props: ShareLinkProps) {
  const {
    'data-testid': testid = 'share-link',
  } = props
  const { routing } = useStores()

  const handleClick = () => {
    if ('share' in navigator) {
      (navigator as any).share({
        title: 'Sound Color Project',
        text: 'Play around with light and sound with Sound Color Project',
        url: 'https://soundcolorproject.com/sovis'
      })
    } else {
      routing.showSharePanel = true
    }
  }

  return useObserver(() => (
    <div onClick={handleClick} className={cn(shareLink, { [hidden]: routing.showSharePanel })} data-testid={testid}>
      Share Sound Color Project
    </div>
  ))
}

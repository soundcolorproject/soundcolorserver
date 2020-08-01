
import { RouteComponentProps } from '@reach/router'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { shareText, shareTitle, shareUrl } from '../../helpers/share'
import { useStores } from '../../state/useStores'

import { hidden, shareLink } from './shareLink.pcss'

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
        title: shareTitle,
        text: shareText,
        url: shareUrl,
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

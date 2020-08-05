
import { RouteComponentProps } from '@reach/router'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { shareText, shareTitle, shareUrl } from '../../helpers/share'
import { useStores } from '../../state/useStores'

import { hidden, shareLink, button } from './shareLink.pcss'

interface ShareArgs {
  title?: string
  text?: string
  url?: string
  files?: ReadonlyArray<File> | FileList
}

declare global {
  interface Navigator {
    canShare (args: ShareArgs): boolean
    share (args: ShareArgs): Promise<void>
  }
}

export interface ShareLinkProps extends RouteComponentProps {
  'data-testid'?: string
}

export const ShareLink: React.FunctionComponent<ShareLinkProps> = function ShareLink (props: ShareLinkProps) {
  const {
    'data-testid': testid = 'share-link',
  } = props
  const { intro, routing } = useStores()

  const handleClick = (ev: React.MouseEvent) => {
    ev.preventDefault()
    if ('share' in navigator) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      }).catch()
    } else {
      routing.showSharePanel = true
    }
  }

  return useObserver(() => (
    <div
      className={cn(shareLink, { [hidden]: routing.showSharePanel || !intro.seenHowItWorks || !intro.warningAccepted })}
      data-testid={testid}
    >
      <button type='button' role='button' onClick={handleClick} className={button}>
        Share Sound Color Project
      </button>
    </div>
  ))
}

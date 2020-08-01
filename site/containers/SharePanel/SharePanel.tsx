
import * as React from 'react'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { sharePanel, show, bigButton, lastButton } from './sharePanel.pcss'
import { Button } from '../../components/Button'
import { LinkButton } from '../../components/LinkButton'
import { fullShareText, shareUrl, shareText, shareTitle, shareImage } from '../../helpers/share'

export interface SharePanelProps extends RouteComponentProps {
  show?: boolean
  'data-testid'?: string
}

export const SharePanel: React.FunctionComponent<SharePanelProps> = function SharePanel (props: SharePanelProps) {
  const {
    show: shouldShow,
    'data-testid': testid = 'share-panel',
  } = props
  const { routing } = useStores()
  const [linkCopied, setLinkCopied] = React.useState(false)
  const lcTimeout = React.useRef<any>()

  React.useEffect(() => {
    if (linkCopied) {
      if (lcTimeout.current) {
        clearTimeout(lcTimeout.current)
      }
      lcTimeout.current = setTimeout(() => setLinkCopied(false), 3000)
    }
  }, [linkCopied])

  const shareFacebook = () => {
    let url = 'https://www.facebook.com/sharer/sharer.php'
    url += `?u=${encodeURIComponent(shareUrl)}`
    url += `&title=${encodeURIComponent(shareTitle)}`
    url += `&quote=${encodeURIComponent(shareText)}`
    url += `&picture=${encodeURIComponent(shareImage)}`

    open(url, '_blank')
  }

  const shareTwitter = () => {
    let url = 'https://twitter.com/intent/tweet'
    url += `?text=${encodeURIComponent(fullShareText)}`

    open(url, '_blank')
  }

  const copyLink = async (ev: React.MouseEvent) => {
    ev.preventDefault()
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(shareUrl)
    } else {
      const textarea = document.createElement('textarea')
      textarea.innerHTML = shareUrl
      textarea.style.display = 'none'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setLinkCopied(true)
  }

  return useObserver(() => (
    <div className={cn(sharePanel, { [show]: shouldShow || routing.showSharePanel })} data-testid={testid}>
      <div>Share Sound Color Project on:</div>
      <div><Button forceLightText className={bigButton} preIcon='facebook' color='#1877F2' onClick={shareFacebook}>Facebook</Button></div>
      <div><Button forceLightText className={bigButton} preIcon='twitter' color='#1DA1F2' onClick={shareTwitter}>Twitter</Button></div>
      <div><a href='/sovis' onClick={copyLink}>{linkCopied ? 'Link Copied!' : 'Copy Link'}</a></div>
      <div className={lastButton}><Button onClick={() => routing.showSharePanel = false}>Cancel</Button></div>
    </div>
  ))
}

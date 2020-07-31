
import * as React from 'react'
import * as cn from 'classnames'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { sharePanel, show, bigButton, lastButton } from './sharePanel.pcss'
import { Button } from '../../components/Button'

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

  return useObserver(() => (
    <div className={cn(sharePanel, { [show]: shouldShow || routing.showSharePanel })} data-testid={testid}>
      <div>Share Sound Color Project on:</div>
      <div><Button forceLightText className={bigButton} preIcon='facebook' color='#1877F2'>Facebook</Button></div>
      <div><Button forceLightText className={bigButton} preIcon='twitter' color='#1DA1F2'>Twitter</Button></div>
      <div><a>Copy Link</a></div>
      <div className={lastButton}><Button>Cancel</Button></div>
    </div>
  ))
}

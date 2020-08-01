
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { logger } from '../../../shared/logger'
import { Panel } from '../../components/Panel'
import { PanelButton } from '../../components/PanelButton'
import { promptInstall } from '../../registerServiceWorker'
import { useStores } from '../../state/useStores'

import { actionsPanel } from './actionsPanel.pcss'

export interface ActionsPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = function ActionsPanel (props: ActionsPanelProps) {
  const {
    'data-testid': testid = 'actions-panel',
  } = props

  const { renderState } = useStores()

  const onScreenshot = () => {
    logger.info('taking screenshot')
    renderState.takeScreenshot().catch(e => {
      logger.error('Could not take screenshot!', e)
    })
  }

  return useObserver(() => (
    <Panel title='Ations' className={actionsPanel} data-testid={testid}>
      <PanelButton onClick={promptInstall} data-testid={`${testid}-install-button`}>
        Install SOVIS App
      </PanelButton>
      <PanelButton disabled={!renderState.showColors} onClick={onScreenshot} data-testid={`${testid}-screenshot-button`}>
        Take a screenshot
      </PanelButton>
    </Panel>
  ))
}

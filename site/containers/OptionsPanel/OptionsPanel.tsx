
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { optionsPanel } from './optionsPanel.pcss'
import { Panel } from '../../components/Panel'
import { PanelButton } from '../../components/PanelButton'

export interface OptionsPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

export const OptionsPanel: React.FunctionComponent<OptionsPanelProps> = function OptionsPanel (props: OptionsPanelProps) {
  const {
    'data-testid': testid = 'options-panel',
  } = props

  return useObserver(() => (
    <Panel title='Options' className={optionsPanel} data-testid={testid}>
      <PanelButton toRoute='colorOptions' data-testid={`${testid}-color-button`}>
        Color
      </PanelButton>
      <PanelButton toRoute='visualizationOptions' data-testid={`${testid}-visualization-button`}>
        Visualization
      </PanelButton>
      <PanelButton toRoute='timingOptions' data-testid={`${testid}-timing-button`}>
        Timing
      </PanelButton>
    </Panel>
  ))
}

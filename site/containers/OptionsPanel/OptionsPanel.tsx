
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Panel } from '../../components/Panel'
import { PanelButton } from '../../components/PanelButton'

import { optionsPanel } from './optionsPanel.pcss'

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

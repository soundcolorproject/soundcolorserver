
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { hueGroupSelector } from './hueGroupSelector.pcss'
import { Panel } from '../../components/Panel'
import { PanelDetail } from '../../components/PanelDetail'
import { PanelButton } from '../../components/PanelButton'

export interface HueGroupSelectorProps extends RouteComponentProps {
  'data-testid'?: string
}

export const HueGroupSelector: React.FunctionComponent<HueGroupSelectorProps> = function HueGroupSelector (props: HueGroupSelectorProps) {
  const {
    'data-testid': testid = 'hue-group-selector',
  } = props
  const { apiStatus, routing } = useStores()

  const onClick = (lightGroupId: number | undefined) => () => {
    apiStatus.lightGroupId = lightGroupId
    routing.popSubrouteToRoot()
  }

  const renderContent = () => {
    if (apiStatus.lightGroupFetchError) {
      return (
        <PanelDetail>
          Failed to fetch light groups!
        </PanelDetail>
      )
    }

    if (apiStatus.loadingLightGroups || !apiStatus.lightGroups) {
      return (
        <PanelDetail>
          Finding light groups...
        </PanelDetail>
      )
    }

    if (apiStatus.lightGroups.length < 1) {
      return (
        <PanelDetail>
          No light groups found
        </PanelDetail>
      )
    }

    return (
      <>
        {
          apiStatus.lightGroups.map(group => (
            <PanelButton key={group.id} onClick={onClick(group.id)}>
              {group.name}
            </PanelButton>
          ))
        }
      </>
    )
  }

  return useObserver(() => (
    <Panel title='Philips Hue' data-testid={testid}>
      {renderContent()}
    </Panel>
  ))
}

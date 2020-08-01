
import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Panel } from '../../components/Panel'
import { PanelButton } from '../../components/PanelButton'
import { PanelDetail } from '../../components/PanelDetail'
import { useStores } from '../../state/useStores'

import { hueGroupSelector } from './hueGroupSelector.pcss'

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
      apiStatus.lightGroups.map(group => (
        <PanelButton key={group.id} active={group.id === apiStatus.lightGroupId} onClick={onClick(group.id)}>
          {group.name}
        </PanelButton>
      ))
    )
  }

  const logout = () => {
    apiStatus.logout().catch()
    routing.popSubroute()
  }

  return useObserver(() => (
    <Panel
      title='Philips Hue'
      button={apiStatus.remoteApi ? { text: 'Logout', onClick: logout } : undefined}
      data-testid={testid}
    >
      {renderContent()}
    </Panel>
  ))
}

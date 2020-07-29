
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps, Redirect } from '@reach/router'
import { useStores } from '../../state/useStores'

import { hueConnectLocal } from './hueConnectLocal.pcss'
import { PanelDetail } from '../../components/PanelDetail'
import { PanelButton } from '../../components/PanelButton'
import { Panel } from '../../components/Panel'

export interface HueConnectLocalProps extends RouteComponentProps {
  'data-testid'?: string
}

export const HueConnectLocal: React.FunctionComponent<HueConnectLocalProps> = function HueConnectLocal (props: HueConnectLocalProps) {
  const {
    'data-testid': testid = 'hue-connect-local',
  } = props
  const { apiStatus, routing } = useStores()

  function renderContent () {
    if (apiStatus.offline) {
      return (
        <PanelDetail>
          You are currently offline.
        </PanelDetail>
      )
    }
    if (apiStatus.connectingLocal) {
      return (
        <PanelDetail>
          Connecting...
        </PanelDetail>
      )
    }
    if (apiStatus.localConnectionStatus === 'no bridges') {
      return (
        <PanelDetail>
          There appear to be no hue bridges on your local network.
        </PanelDetail>
      )
    }
    if (apiStatus.localConnectionStatus === 'not connected') {
      return (
        <>
          <PanelDetail>
            Unable to connect to a hue bridge on the current network.  You may have to press the button on your hue bridge, then try connecting again.
          </PanelDetail>
          <PanelButton onClick={apiStatus.connectLocal}>
            Retry connecting to hue bridge
          </PanelButton>
        </>
      )
    }

    return (
      <PanelDetail>hyup</PanelDetail>
    )
  }

  return useObserver(() => {
    React.useEffect(() => {
      if (apiStatus.authenticated) {
        routing.popSubrouteTo('hueGroupSelector')
      }
      if (apiStatus.remoteApi) {
        routing.popSubroute()
      }
    }, [apiStatus.authenticated, apiStatus.remoteApi])

    React.useEffect(() => {
      apiStatus.connectLocal().catch()
    }, [])

    return (
      <Panel title='Philips Hue' className={hueConnectLocal} data-testid={testid}>
        {renderContent()}
      </Panel>
    )
  })
}

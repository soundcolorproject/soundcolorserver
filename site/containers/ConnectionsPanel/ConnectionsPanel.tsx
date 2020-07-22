
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { Panel } from '../../components/Panel'

import { PanelButton } from '../../components/PanelButton'

export interface ConnectionsPanelProps extends RouteComponentProps {
  'data-testid'?: string
}

export const ConnectionsPanel: React.FunctionComponent<ConnectionsPanelProps> = function ConnectionsPanel (props: ConnectionsPanelProps) {
  const {
    'data-testid': testid = 'connections-panel',
  } = props
  const { media, apiStatus, routing } = useStores()

  const currentSource = () => {
    if (media.currentDeviceId) {
      const device = media.possibleDevices.find((dev) => dev.deviceId === media.currentDeviceId)
      if (device) {
        return device.label || device.deviceId
      }
    }

    return 'None'
  }

  const audioSourceClicked = React.useCallback(() => {
    routing.goToSubroute('audioSource')
  }, [routing])

  const hueClicked = React.useCallback(() => {
    routing.goToSubroute('hueGroupSelector')
  }, [routing])

  const renderHueButton = () => {
    if (!apiStatus.authenticated) {
      return (
        <PanelButton href='/login' suffix='Login' data-testid={`${testid}-philips-hue-button`} endIcon='launch'>
          Philips Hue
        </PanelButton>
      )
    } else {
      const suffix = apiStatus.lightGroupId
        ? apiStatus.lightGroups?.find(g => g.id === apiStatus.lightGroupId)?.name || ''
        : 'Select one'
      return (
        <PanelButton suffix={suffix} data-testid={`${testid}-philips-hue-button`} onClick={hueClicked} endIcon='play'>
          Philips Hue
        </PanelButton>
      )
    }
  }

  return useObserver(() => (
    <Panel title='Connections' data-testid={testid}>
      <PanelButton onClick={audioSourceClicked} suffix={currentSource()} data-testid={`${testid}-audio-source-button`} endIcon='play'>
        Audio Source
      </PanelButton>
      <PanelButton disabled suffix='No audio source with tracks' data-testid={`${testid}-tracks-button`} endIcon='play'>
        Tracks
      </PanelButton>
      {renderHueButton()}
    </Panel>
  ))
}
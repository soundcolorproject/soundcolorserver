
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'
import { useStores } from '../../state/useStores'

import { Panel } from '../../components/Panel'

import { PanelButton } from '../../components/PanelButton'
import api from '@storybook/addon-storyshots'

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

  const renderHueButton = () => {
    if (apiStatus.offline) {
      return (
        <PanelButton disabled suffix='Requires internet access' data-testid={`${testid}-philips-hue-button`}>
          Philips Hue
        </PanelButton>
      )
    }

    if (!apiStatus.authenticated) {
      if (apiStatus.remoteApi) {
        if (apiStatus.allowCookies) {
          return (
            <PanelButton href='/login' suffix='Login' data-testid={`${testid}-philips-hue-button`} endIcon='launch'>
              Philips Hue
            </PanelButton>
          )
        } else {
          return (
            <PanelButton toRoute='' suffix='Login' data-testid={`${testid}-philips-hue-button`} endIcon='play'>
              Philips Hue
            </PanelButton>
          )
        }
      } else {
        return (
          <PanelButton toRoute='hueConnectLocal' suffix='Connect' data-testid={`${testid}-philips-hue-button`} endIcon='play'>
            Philips Hue
          </PanelButton>
        )
      }
    } else {
      const suffix = apiStatus.lightGroupId
        ? apiStatus.lightGroups?.find(g => g.id === apiStatus.lightGroupId)?.name || ''
        : 'Select one'
      return (
        <PanelButton toRoute='hueGroupSelector' suffix={suffix} data-testid={`${testid}-philips-hue-button`}>
          Philips Hue
        </PanelButton>
      )
    }
  }

  // TODO: https://github.com/soundcolorproject/soundcolorserver/issues/3
  return useObserver(() => (
    <Panel title='Connections' data-testid={testid}>
      <PanelButton toRoute='audioSource' suffix={currentSource()} data-testid={`${testid}-audio-source-button`}>
        Audio Source
      </PanelButton>
      {/* <PanelButton disabled suffix='No audio source with tracks' data-testid={`${testid}-tracks-button`} endIcon='play'>
        Tracks
      </PanelButton> */}
      {renderHueButton()}
    </Panel>
  ))
}


import { RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Panel } from '../../components/Panel'
import { PanelButton } from '../../components/PanelButton'
import { useStores } from '../../state/useStores'

import { audioSourceSelector } from './audioSourceSelector.pcss'

export interface AudioSourceSelectorProps extends RouteComponentProps {
  'data-testid'?: string
}

export const AudioSourceSelector: React.FunctionComponent<AudioSourceSelectorProps> = function AudioSourceSelector (props: AudioSourceSelectorProps) {
  const {
    'data-testid': testid = 'audio-source-selector',
  } = props
  const { media, routing } = useStores()

  const handleClick = (deviceId: string) => () => {
    media.currentDeviceId = deviceId
    routing.popSubroute()
  }

  const renderDevice = (device: MediaDeviceInfo, index: number) => (
    <PanelButton active={device.deviceId === media.currentDeviceId} key={device.deviceId} onClick={handleClick(device.deviceId)}>
      {device.label || `Device ${index + 1}`}
    </PanelButton>
  )

  return useObserver(() => (
    <Panel title='Audio Source' className={audioSourceSelector} data-testid={testid}>
      {
        media.error || !media.ready
          ? 'Please allow microphone access to view audio sources.'
          : media.possibleDevices.length === 0
          ? 'No audio sources connected.'
          : media.possibleDevices.map(renderDevice)
      }
    </Panel>
  ))
}


import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { MediaProp } from '../../state/mediaStore'

import { ClickableMenuOption } from '../../components/MenuOption'
import { BackOption } from '../BackOption'

import { audioSourceSelector } from './audioSourceSelector.pcss'
import { RoutingProp } from '../../state/routingStore'

interface OwnProps {
  height?: number
  domRef?: React.Ref<HTMLDivElement>
}

type StateProps = MediaProp & RoutingProp

export type AudioSourceSelectorProps = OwnProps & StateProps

export const AudioSourceSelector = injectAndObserve<StateProps, OwnProps>(
  ({ media, routing }) => ({ media, routing }),
  class AudioSourceSelector extends React.Component<AudioSourceSelectorProps> {
    onClick = (deviceId: string) => () => {
      this.props.media.currentDeviceId = deviceId
      this.props.routing.popSubroute()
    }

    renderDevice = (device: MediaDeviceInfo, index: number) => (
      <ClickableMenuOption key={device.deviceId} onClick={this.onClick(device.deviceId)}>
        <>{device.label || `Device ${index}`}</>
      </ClickableMenuOption>
    )

    render () {
      const { media: { possibleDevices }, domRef } = this.props
      return (
        <div ref={domRef} className={audioSourceSelector}>
          <BackOption name='Audio Source' />
          {
            possibleDevices.map(this.renderDevice)
          }
        </div>
      )
    }
  },
)

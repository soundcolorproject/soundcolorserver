
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { MediaProp } from '../../state/mediaStore'

import { deviceChooser } from './deviceChooser.pcss'

interface OwnProps {

}

type StateProps = MediaProp

export type DeviceChooserProps = OwnProps & StateProps

export const DeviceChooser = injectAndObserve<StateProps, OwnProps>(
  ({ media }) => ({ media }),
  class DeviceChooser extends React.Component<DeviceChooserProps> {
    onDeviceChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.media.currentDeviceId = ev.target.value
    }
    render () {
      const { media } = this.props
      return (
        <div id={deviceChooser}>
          <label>
            Audio Source <br/>
            <select value={media.currentDeviceId} onChange={this.onDeviceChange}>
              {
                media.possibleDevices.map(({ deviceId, label }) => (
                  <option key={deviceId} value={deviceId}>{label}</option>
                ))
              }
            </select>
          </label>
        </div>
      )
    }
  },
)

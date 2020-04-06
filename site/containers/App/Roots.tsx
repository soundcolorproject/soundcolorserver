
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { ColorRenderer } from '../ColorRenderer'
import { DeviceChooser } from '../DeviceChooser'
import { Footer } from '../Footer'
import { MiniAnalyser } from '../MiniAnalyser'
import { PatternPicker } from '../PatternPicker'
import { Shortcuts } from '../Shortcuts'
import { Sliders } from '../Sliders'
import { SoundDetails } from '../SoundDetails'
import { TextHider } from '../TextHider'

import { MediaProp } from '../../state/mediaStore'

import { detailsView, spreader, info } from './root.pcss'

interface OwnProps {
}

type StateProps = MediaProp

export type RootProps = OwnProps & StateProps

export const Root = injectAndObserve<StateProps, OwnProps>(
  ({ media }) => ({ media }),
  class Root extends React.Component<RootProps> {
    render () {
      const { media } = this.props
      if (media.ready) {
        return (
          <div id={detailsView}>
            <ColorRenderer/>
            <TextHider>
              <h1>SoundColor</h1>
              <p>Select a color pattern:</p>
              <PatternPicker/>
              <SoundDetails/>
              <MiniAnalyser/>
              <div id={spreader} />
              <DeviceChooser/>
              <Footer>
                <Shortcuts/>
                <Sliders/>
              </Footer>
              <div id={info}>
                <a aria-label='About Sound Color Project' href='/info.html'>Info</a>
              </div>
            </TextHider>
          </div>
        )
      } else if (media.error) {
        return (
          <div id={detailsView}>
            <h1>SoundColor</h1>
            <p>Something went wrong while initializing your microphone.</p>
            <p>Please allow microphone access and refresh the page.</p>
          </div>
        )
      } else {
        return (
          <div id={detailsView}>
            <h1>SoundColor</h1>
            <p>Please allow microphone access to begin.</p>
          </div>
        )
      }
    }
  },
)

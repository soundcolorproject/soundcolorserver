
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { injectAndObserve } from '../../state/injectAndObserve'
import { ColorRenderer } from '../../containers/ColorRenderer'
import { DeviceChooser } from '../../containers/DeviceChooser'
import { Footer } from '../../containers/Footer'
import { MiniAnalyser } from '../../containers/MiniAnalyser'
import { PatternPicker } from '../../containers/PatternPicker'
import { Shortcuts } from '../../containers/Shortcuts'
import { Sliders } from '../../containers/Sliders'
import { SoundDetails } from '../../containers/SoundDetails'
import { TextHider } from '../../components/TextHider'

import { MediaProp } from '../../state/mediaStore'

import { detailsView, spreader, info } from './root.pcss'
import { LightGroupChooser } from '../../containers/LightGroupChooser'

interface OwnProps extends RouteComponentProps {
}

type StateProps = MediaProp

export type RootProps = OwnProps & StateProps

export const RootRoute = injectAndObserve<StateProps, OwnProps>(
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
              <LightGroupChooser/>
              <SoundDetails/>
              <MiniAnalyser/>
              <div id={spreader} />
              <DeviceChooser/>
              <Footer>
                <Shortcuts/>
                <Sliders/>
              </Footer>
              <div id={info}>
                <Link aria-label='About Sound Color Project' to='/info'>Info</Link>
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
            <div id={spreader} />
            <div id={info}>
              <Link aria-label='About Sound Color Project' to='/info'>Info</Link>
            </div>
          </div>
        )
      } else {
        return (
          <div id={detailsView}>
            <h1>SoundColor</h1>
            <p>Please allow microphone access to begin.</p>
            <div id={spreader} />
            <div id={info}>
              <Link aria-label='About Sound Color Project' to='/info'>Info</Link>
            </div>
          </div>
        )
      }
    }
  },
)

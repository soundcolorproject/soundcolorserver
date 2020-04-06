
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { injectAndObserve } from '../../state/injectAndObserve'
import { ColorRenderer } from '../../components/ColorRenderer'
import { DeviceChooser } from '../../components/DeviceChooser'
import { Footer } from '../../components/Footer'
import { MiniAnalyser } from '../../components/MiniAnalyser'
import { PatternPicker } from '../../components/PatternPicker'
import { Shortcuts } from '../../components/Shortcuts'
import { Sliders } from '../../components/Sliders'
import { SoundDetails } from '../../components/SoundDetails'
import { TextHider } from '../../components/TextHider'

import { MediaProp } from '../../state/mediaStore'

import { detailsView, spreader, info } from './root.pcss'

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


import * as React from 'react'
import { Link, RouteComponentProps, navigate } from '@reach/router'
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
import { PanelLayout } from '../../components/PanelLayout'
import { Panel } from '../../components/Panel/Panel'
import { HomeRow } from '../../components/HomeRow'
import { RoutingProp, PanelRoute } from '../../state/routingStore'
import { logger } from '../../../shared/logger'
import { RenderStateProp } from '../../state/renderStateStore'
import { PatternsProp } from '../../state/patternsStore'
import { Settings } from '../../containers/Settings'
import { AudioSourceSelector } from '../../containers/AudioSourceSelector'
import { PatternSelector } from '../../containers/PatternSelector'

interface OwnProps extends RouteComponentProps {
}

type StateProps =
  & MediaProp
  & PatternsProp
  & RenderStateProp
  & RoutingProp

export type RootProps = OwnProps & StateProps

const routeOrder: { [key in PanelRoute]: number } = {
  'info': 0,
  'settings': 1,
  'home': 2,
  'filters': 3,
  'palette': 4,
}

// ROUTES
const settingsRoute = (
  <Settings />
)

const homeRoute = (
  <SoundDetails />
)

const filtersRoute = (
  <Sliders />
)

const paletteRoute = (
  <PatternSelector />
)

// SUB-ROUTES
const audioSourceRoute = (
  <AudioSourceSelector />
)

const customPaletteRoute = (
  <div>Custom palette goes here</div>
)

export const RootRoute = injectAndObserve<StateProps, OwnProps>(
  ({ media, patterns, renderState, routing }) => ({ media, patterns, renderState, routing }),
  class Root extends React.Component<RootProps> {
    renderPanelChild = () => {
      const { subRoutes } = this.props.routing
      if (subRoutes.length > 0) {
        switch (subRoutes[0]) {
          case 'audioSource': return audioSourceRoute
          case 'customPalette': return customPaletteRoute
          default: break
        }
      }

      const { routing } = this.props
      switch (routing.panelRoute) {
        case 'settings': return settingsRoute
        case 'home': return homeRoute
        case 'filters': return filtersRoute
        case 'palette': return paletteRoute
        default: return homeRoute
      }
    }

    panelRecompute = () => {
      const { renderState, patterns } = this.props
      if (!renderState || !patterns) {
        return ''
      }

      let value = ''
      if (renderState.showColors) value += 'sc:'
      if (patterns.currentPattern) value += `${patterns.currentPattern}:`
      return value
    }

    setPanelRoute = (route: PanelRoute) => {
      if (route === 'info') {
        this.props.navigate!('/info').catch(e => {
          logger.error('Could not route to `/info`', e)
        })
        return
      }
      const { routing } = this.props
      if (route === routing.panelRoute) {
        return
      }

      const isBack = routeOrder[route] < routeOrder[routing.panelRoute]
      routing.setPanelRoute(route, isBack)
    }

    render () {
      const { media, routing } = this.props
      if (media.ready) {
        return (
          <div id={detailsView}>
            <TextHider>
              <PanelLayout
                preSpacer={
                  <Shortcuts />
                }
                inSpacer={<MiniAnalyser/>}
                postSpacer={
                  <>
                    <Panel recompute={this.panelRecompute()} back={routing.isBack}>
                      {this.renderPanelChild()}
                    </Panel>
                    <HomeRow
                      selected={routing.panelRoute}
                      buttons={{
                        info: 'info',
                        settings: 'settings',
                        home: 'home',
                        filters: 'tune',
                        palette: 'palette',
                      }}
                      onChange={this.setPanelRoute}
                    />
                  </>
                }
              />
              {/* <h1>SoundColor</h1>
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
              </div> */}
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

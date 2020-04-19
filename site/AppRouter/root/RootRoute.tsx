
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'

import { logger } from '../../../shared/logger'

import { injectAndObserve } from '../../state/injectAndObserve'
import { MediaProp } from '../../state/mediaStore'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { RoutingProp, PanelRoute } from '../../state/routingStore'

import { HomeRow } from '../../components/HomeRow'
import { Panel } from '../../components/Panel'
import { PanelLayout } from '../../components/PanelLayout'

import { AudioSourceSelector } from '../../containers/AudioSourceSelector'
import { CustomPatternSelector } from '../../containers/CustomPatternSelector'
import { HueRoot } from '../../containers/HueRoot'
import { CanvasMiniAnalyser } from '../../containers/MiniAnalyser'
import { PatternSelector } from '../../containers/PatternSelector'
import { Settings } from '../../containers/Settings'
import { Shortcuts } from '../../containers/Shortcuts'
import { Sliders } from '../../containers/Sliders'
import { SoundDetails } from '../../containers/SoundDetails'

// Should be a container
import { TextHider } from '../../components/TextHider'

import { detailsView, spreader, info } from './root.pcss'
import { HueGroupSelector } from '../../containers/HueGroupSelector/HueGroupSelector'
import { FavoriteSelector } from '../../containers/FavoriteSelector'

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
  <Settings height={140} />
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
  <CustomPatternSelector height={300} />
)

const hueRootRoute = (
  <HueRoot />
)

const hueGroupRoute = (
  <HueGroupSelector />
)

const favoritesRoute = (
  <FavoriteSelector />
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
          case 'hueRoot': return hueRootRoute
          case 'hueGroupSelector': return hueGroupRoute
          case 'favoriteCusom': return favoritesRoute
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
                inSpacer={<CanvasMiniAnalyser/>}
                postSpacer={
                  <Panel recompute={this.panelRecompute()} back={routing.isBack}>
                    {this.renderPanelChild()}
                  </Panel>
                }
                footer={
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
                }
              />
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

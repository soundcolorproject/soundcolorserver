
import * as React from 'react'
import { Link, RouteComponentProps } from '@reach/router'

import { logger } from '../../../shared/logger'

import { injectAndObserve } from '../../state/injectAndObserve'
import { PatternsProp } from '../../state/patternsStore'
import { RenderStateProp } from '../../state/renderStateStore'
import { RoutingProp, PanelRoute } from '../../state/routingStore'

import { HomeRow } from '../../components/HomeRow'
import { Panel } from '../../components/Panel'
import { PanelLayout } from '../../components/PanelLayout'

import { ShaderCanvas } from '../../containers/ShaderCanvas'
import { AudioSourceSelector } from '../../containers/AudioSourceSelector'
import { CustomPatternSelector } from '../../containers/CustomPatternSelector'
import { FavoriteSelector } from '../../containers/FavoriteSelector'
import { HueGroupSelector } from '../../containers/HueGroupSelector'
import { HueRoot } from '../../containers/HueRoot'
import { CanvasMiniAnalyser } from '../../containers/MiniAnalyser'
import { PatternSelector } from '../../containers/PatternSelector'
import { Settings } from '../../containers/Settings'
import { ShaderSliders } from '../../containers/ShaderSliders'
import { Shortcuts } from '../../containers/Shortcuts'
import { Sliders } from '../../containers/Sliders'
import { SoundDetails } from '../../containers/SoundDetails'

// Should be a container
import { TextHider } from '../../components/TextHider'

import { detailsView } from './root.pcss'
import { NoColorNotification } from '../../containers/NoColorNotification'
import { ShaderSelector } from '../../containers/ShaderSelector'

interface OwnProps extends RouteComponentProps {
}

type StateProps =
  & PatternsProp
  & RenderStateProp
  & RoutingProp

export type RootProps = OwnProps & StateProps

const routeOrder: { [key in PanelRoute]: number } = {
  'info': 0,
  'palette': 1,
  'home': 2,
  'filters': 3,
  'settings': 4,
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

const shaderSlidersRoute = (
  <ShaderSliders />
)

const shaderSelectorRoute = (
  <ShaderSelector />
)

export const RootRoute = injectAndObserve<StateProps, OwnProps>(
  ({ patterns, renderState, routing }) => ({ patterns, renderState, routing }),
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
          case 'shaderSliders': return shaderSlidersRoute
          case 'shaderSelector': return shaderSelectorRoute
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
        routing.popSubrouteToRoot()
        return
      }

      const isBack = routeOrder[route] < routeOrder[routing.panelRoute]
      routing.setPanelRoute(route, isBack)
    }

    render () {
      const { routing, renderState } = this.props
      return (
        <div id={detailsView}>
          {/* <ColorRenderer/> */}
          <ShaderCanvas shaderName={renderState.shader} />
          <TextHider>
            <PanelLayout
              above={<NoColorNotification />}
              preSpacer={<Shortcuts />}
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
                    palette: 'palette',
                    home: 'music_note',
                    filters: 'tune',
                    settings: 'settings',
                  }}
                  onChange={this.setPanelRoute}
                />
              }
            />
          </TextHider>
        </div>
      )
    }
  },
)

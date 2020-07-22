
import * as React from 'react'
import { useObserver } from 'mobx-react'
import { RouteComponentProps } from '@reach/router'

import { logger } from '../../../shared/logger'
import { useStores } from '../../state/useStores'

import { PanelRoute, RoutingStore } from '../../state/routingStore'

import { ShrinkingSidePanel } from '../../components/ShrinkingSidePanel'
import { ShrinkingPanelButton } from '../../components/ShrinkingPanelButton'
import { IconName } from '../../components/Icon'
import { MainPanelWithShrinkingSide } from '../../components/MainPanelWithShrinkingSide'

// Should be a container
import { TextHider } from '../../components/TextHider'

import { AudioSourceSelector } from '../../containers/AudioSourceSelector'
import { CustomPatternSelector } from '../../containers/CustomPatternSelector'
import { SavedPaletteSelector } from '../../containers/SavedPaletteSelector'
import { HueGroupSelector } from '../../containers/HueGroupSelector'
import { PatternSelector } from '../../containers/PatternSelector'
import { ShaderSliders } from '../../containers/ShaderSliders'
import { SoundDetails } from '../../containers/SoundDetails'
import { ShaderCanvas } from '../../containers/ShaderCanvas'
import { Shortcuts } from '../../containers/Shortcuts'
import { CanvasMiniAnalyser } from '../../containers/MiniAnalyser'
import { ConnectionsPanel } from '../../containers/ConnectionsPanel'
import { OptionsPanel } from '../../containers/OptionsPanel'
import { ShaderSelector } from '../../containers/ShaderSelector'

import { sovis, sovisPanel } from './sovis.pcss'
import { ColorOptionsPanel } from '../../containers/ColorOptionsPanel'
import { TimingOptionsPanel } from '../../containers/TimingOptionsPanel'
import { VisualizationOptionsPanel } from '../../containers/VisualizationOptionsPanel'

export interface SovisRouteProps extends RouteComponentProps {
}

// ROUTES
const soundDetails = (
  <SoundDetails />
)

const optionsRoute = (
  <OptionsPanel />
)

const paletteRoute = (
  <PatternSelector />
)

// SUB-ROUTES
const audioSourceRoute = (
  <AudioSourceSelector />
)
const colorOptions = (
  <ColorOptionsPanel />
)

const connectionsRoute = (
  <ConnectionsPanel />
)

const customPaletteRoute = (
  <CustomPatternSelector />
)

const hueGroupRoute = (
  <HueGroupSelector />
)

const favoritesRoute = (
  <SavedPaletteSelector />
)

const shaderSlidersRoute = (
  <ShaderSliders />
)

const shaderSelectorRoute = (
  <ShaderSelector />
)

const timingOptionsRoute = (
  <TimingOptionsPanel />
)

const visualizationOptionsRoute = (
  <VisualizationOptionsPanel />
)

interface PanelDetail {
  title: string
  icon: IconName
}

const panels: PanelRoute[] = ['palette', 'connections', 'options', 'sound']
const panelDetails: Record<PanelRoute, PanelDetail> = {
  home: {
    title: 'Sound Color Project',
    icon: 'logo',
  },
  palette: {
    title: 'Color Patterns',
    icon: 'colors',
  },
  connections: {
    title: 'Connections',
    icon: 'connections',
  },
  options: {
    title: 'Options',
    icon: 'tune',
  },
  sound: {
    title: 'Sound Details',
    icon: 'music_note',
  },
  info: {
    title: 'Sound Details',
    icon: 'music_note',
  },
  // actions: {
  //   title: 'Actions',
  //   icon: 'download',
  // },
}

function getPanelChild (routing: RoutingStore) {
  if (routing.subRoutes.length > 0) {
    switch (routing.subRoutes[0]) {
      case 'audioSource': return audioSourceRoute
      case 'colorOptions': return colorOptions
      case 'customPalette': return customPaletteRoute
      case 'hueGroupSelector': return hueGroupRoute
      case 'favoriteCusom': return favoritesRoute
      case 'shaderSliders': return shaderSlidersRoute
      case 'shaderSelector': return shaderSelectorRoute
      case 'timingOptions': return timingOptionsRoute
      case 'visualizationOptions': return visualizationOptionsRoute
      default: break
    }
  }

  switch (routing.panelRoute) {
    case 'connections': return connectionsRoute
    case 'options': return optionsRoute
    case 'palette': return paletteRoute
    case 'sound': return soundDetails
    default: return null
  }
}

export function SovisRoute (props: SovisRouteProps) {
  const { routing, renderState } = useStores()

  const goBack = React.useCallback(() => {
    if (routing.subRoutes.length > 0) {
      routing.popSubroute()
    } else {
      routing.panelRoute = 'home'
    }
  }, [routing])

  const setPanelRoute = (route: PanelRoute) => () => {
    if (route === 'info') {
      logger.info('firing screen view event for', 'info')
      gtag('event', 'screen_view', {
        screen_name: 'info',
      })
      props.navigate!('/').catch(e => {
        logger.error('Could not route to `/`', e)
      })
      return
    }

    if (route === routing.panelRoute) {
      routing.popSubrouteToRoot()
      return
    }

    const isDown = panels.indexOf(route) < panels.indexOf(routing.panelRoute)
    routing.setPanelRoute(route, isDown ? 'down' : 'up')
  }

  const panel = () => routing.panelRoute
  const shrink = () => panel() !== 'home'

  const sidePanel = () => (
    <ShrinkingSidePanel shrink={shrink()}>
      <ShrinkingPanelButton
        icon={shrink() ? 'arrow_back' : 'logo'}
        noBold
        shrink={shrink()}
        href={shrink() ? undefined : '/'}
        onClick={shrink() ? goBack : undefined}
      >
        Sound Color Project
      </ShrinkingPanelButton>
      {
        panels.map(name => (
          <ShrinkingPanelButton
            key={name}
            icon={panelDetails[name].icon}
            shrink={shrink()}
            active={panel() === name}
            onClick={setPanelRoute(name)}
          >
            {panelDetails[name].title}
          </ShrinkingPanelButton>
        ))
      }
    </ShrinkingSidePanel>
  )

  return useObserver(() => (
    <div id={sovis}>
      <ShaderCanvas shaderName={renderState.shader} />
      <TextHider>
        <div id={sovisPanel}>
          <MainPanelWithShrinkingSide
            sidePanel={sidePanel()}
            height={288}
            transitionDirection={routing.transitionDirection}
            open={shrink()}
          >
            {getPanelChild(routing)}
          </MainPanelWithShrinkingSide>
          <Shortcuts />
        </div>
        <CanvasMiniAnalyser/>
      </TextHider>
    </div>
  ))
}


import * as React from 'react'
import { RouteComponentProps } from '@reach/router'

import { logger } from '../../../shared/logger'

import { PanelRoute, RoutingStore } from '../../state/routingStore'

import { AudioSourceSelector } from '../../containers/AudioSourceSelector'
import { CustomPatternSelector } from '../../containers/CustomPatternSelector'
import { FavoriteSelector } from '../../containers/FavoriteSelector'
import { HueGroupSelector } from '../../containers/HueGroupSelector'
import { HueRoot } from '../../containers/HueRoot'
import { PatternSelector } from '../../containers/PatternSelector'
import { Settings } from '../../containers/Settings'
import { ShaderSliders } from '../../containers/ShaderSliders'
import { Sliders } from '../../containers/Sliders'
import { SoundDetails } from '../../containers/SoundDetails'

// Should be a container
import { TextHider } from '../../components/TextHider'

import { sovis, sovisPanel } from './sovis.pcss'
import { NoColorNotification } from '../../containers/NoColorNotification'
import { ShaderSelector } from '../../containers/ShaderSelector'
import { useStores } from '../../state/useStores'
import { ShrinkingSidePanel } from '../../components/ShrinkingSidePanel'
import { ShrinkingPanelButton } from '../../components/ShrinkingPanelButton'
import { IconName } from '../../components/Icon'
import { MainPanelWithShrinkingSide } from '../../components/MainPanelWithShrinkingSide'
import { useObserver } from 'mobx-react'
import { ShaderCanvas } from '../../containers/ShaderCanvas'
import { Shortcuts } from '../../containers/Shortcuts'
import { CanvasMiniAnalyser } from '../../containers/MiniAnalyser'

export interface SovisRouteProps extends RouteComponentProps {
}

// ROUTES
const settingsRoute = (
  <Settings height={140} />
)

const soundDetails = (
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
  <CustomPatternSelector />
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

interface PanelDetail {
  title: string
  icon: IconName
}

const panels: PanelRoute[] = ['palette', 'settings', 'filters', 'sound']
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
  filters: {
    title: 'Options',
    icon: 'tune',
  },
  sound: {
    title: 'Sound Details',
    icon: 'music_note',
  },
  settings: {
    title: 'Connections',
    icon: 'connections',
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
      case 'customPalette': return customPaletteRoute
      case 'hueRoot': return hueRootRoute
      case 'hueGroupSelector': return hueGroupRoute
      case 'favoriteCusom': return favoritesRoute
      case 'shaderSliders': return shaderSlidersRoute
      case 'shaderSelector': return shaderSelectorRoute
      default: break
    }
  }

  switch (routing.panelRoute) {
    case 'settings': return settingsRoute
    case 'filters': return filtersRoute
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

  const panel = routing.panelRoute
  const shrink = panel !== 'home'

  const sidePanel = () => (
    <ShrinkingSidePanel shrink={shrink}>
      <ShrinkingPanelButton
        icon={shrink ? 'arrow_back' : 'logo'}
        noBold
        shrink={shrink}
        active={panel === 'home'}
        href={shrink ? undefined : '/'}
        onClick={shrink ? goBack : undefined}
      >
        Sound Color Project
      </ShrinkingPanelButton>
      {
        panels.map(name => (
          <ShrinkingPanelButton
            key={name}
            icon={panelDetails[name].icon}
            shrink={shrink}
            active={panel === name}
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
            height={panel === 'palette' && routing.subRoutes.length === 0 ? 384 : 288}
            transitionDirection={routing.transitionDirection}
            open={shrink}
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

// export const SovisRoute = injectAndObserve<StateProps, OwnProps>(
//   ({ patterns, renderState, routing }) => ({ patterns, renderState, routing }),
//   class Root extends React.Component<SovisRouteProps> {

//     render () {
//       const { routing, renderState } = this.props
//       return (
//         <div id={detailsView}>
//           {/* <ColorRenderer/> */}
//           <ShaderCanvas shaderName={renderState.shader} />
//           <TextHider>
//             <PanelLayout
//               above={<NoColorNotification />}
//               preSpacer={<Shortcuts />}
//               inSpacer={<CanvasMiniAnalyser/>}
//               postSpacer={
//                 <Panel recompute={this.panelRecompute()} back={routing.isBack}>
//                   {this.renderPanelChild()}
//                 </Panel>
//               }
//               footer={
//                 <HomeRow
//                   selected={routing.panelRoute}
//                   buttons={{
//                     palette: 'colors',
//                     settings: 'connections',
//                     filters: 'tune',
//                     home: 'music_note',
//                     info: 'about',
//                   }}
//                   onChange={this.setPanelRoute}
//                 />
//               }
//             />
//           </TextHider>
//         </div>
//       )
//     }
//   },

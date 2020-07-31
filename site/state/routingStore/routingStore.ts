
import { observable, action, reaction } from 'mobx'
import { logger } from '../../../shared/logger'
import { TransitionDirection } from '../../components/MainPanelWithShrinkingSide'

export interface RoutingProp {
  routing: RoutingStore
}

export type PanelRoute =
  | 'home'
  | 'palette'
  | 'connections'
  | 'options'
  | 'sound'
  | 'actions'
  | 'info'

export type SubRoute =
  | 'audioSource'
  | 'colorOptions'
  | 'cookiePolicy'
  | 'customPalette'
  | 'favoriteCusom'
  | 'hueConnectLocal'
  | 'hueGroupSelector'
  | 'visualizationOptions'
  | 'timingOptions'

export class RoutingStore {
  constructor () {
    window.addEventListener('popstate', () => {
      const screenName = this.subRoutes.length > 0 ? this.subRoutes[0] : this.panelRoute
      logger.info('firing screen view event for', screenName)
      gtag('event', 'screen_view', {
        screen_name: screenName,
        event_label: `screen:${screenName}`,
      })

      this.transitionDirection = 'right'
    })

    reaction(
      () => ({
        panelRoute: this.panelRoute,
        subRouteCount: this.subRoutes.length,
        subRoutes: this.subRoutes,
      }),
      ({ panelRoute, subRoutes }) => {
        const screenName = this.subRoutes.length > 0 ? this.subRoutes[0] : this.panelRoute
        logger.info('firing screen view event for', screenName)
        gtag('event', 'screen_view', {
          screen_name: screenName,
        })
      },
    )
  }

  @observable panelRoute: PanelRoute = 'home'
  @observable subRoutes: SubRoute[] = []
  @observable transitionDirection: TransitionDirection = 'right'
  @observable showSharePanel = false

  @action
  setPanelRoute = (route: PanelRoute, direction: TransitionDirection = 'left') => {
    this.subRoutes = []
    this.panelRoute = route
    this.transitionDirection = direction
  }

  @action
  popSubroute = (direction: TransitionDirection = 'right') => {
    this.subRoutes.shift()
    this.transitionDirection = direction
  }

  @action
  popSubrouteToRoot = (route?: SubRoute, direction: TransitionDirection = 'right') => {
    this.subRoutes = []
    this.transitionDirection = direction

    if (route) {
      this.subRoutes.push(route)
    }
  }

  @action
  popSubrouteTo = (route: SubRoute, direction: TransitionDirection = 'right') => {
    const index = this.subRoutes.indexOf(route)
    if (index === 0) {
      return
    }

    this.transitionDirection = direction
    if (index > 0) {
      this.subRoutes.splice(0, index)
    } else {
      this.subRoutes.shift()
      this.subRoutes.push(route)
    }
  }

  @action
  goToSubroute = (route: SubRoute, direction: TransitionDirection = 'left') => {
    this.subRoutes.unshift(route)
    this.transitionDirection = direction
  }
}

export const routingStore = new RoutingStore()

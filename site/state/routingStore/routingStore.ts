
import { observable, action, reaction } from 'mobx'
import { logger } from '../../../shared/logger'

export interface RoutingProp {
  routing: RoutingStore
}

export type PanelRoute =
  | 'info'
  | 'settings'
  | 'home'
  | 'filters'
  | 'palette'

export type SubRoute =
  | 'audioSource'
  | 'hueRoot'
  | 'hueGroupSelector'
  | 'customPalette'
  | 'favoriteCusom'
  | 'shaderSliders'
  | 'shaderSelector'

const routeNames: { [key in SubRoute]: string } = {
  audioSource: 'Audio Source',
  hueRoot: 'Philips Hue',
  hueGroupSelector: 'Light Group',
  customPalette: 'Custom',
  favoriteCusom: 'Favorites',
  shaderSliders: 'Shader',
  shaderSelector: 'Visualization',
}

export class RoutingStore {
  constructor () {
    window.addEventListener('popstate', () => {
      logger.info('firing screen view event for', screenName)
      gtagPatched('event', 'screen_view', {
        screen_name: this.subRoutes[0] || this.panelRoute,
        event_label: `screen:${this.subRoutes[0] || this.panelRoute}`,
      })

      this.isBack = true
    })

    reaction(
      () => ({
        panelRoute: this.panelRoute,
        subRouteCount: this.subRoutes.length,
        subRoutes: this.subRoutes,
      }),
      ({ panelRoute, subRoutes }) => {
        const screenName = subRoutes[0] || panelRoute
        logger.info('firing screen view event for', screenName)
        gtagPatched('event', 'screen_view', {
          screen_name: screenName,
        })
      },
    )
  }

  @observable panelRoute: PanelRoute = 'palette'
  @observable subRoutes: SubRoute[] = []
  @observable isBack = false

  getSubRouteName () {
    if (this.subRoutes.length === 0) {
      return ''
    }
    return routeNames[this.subRoutes[0]]
  }

  @action
  setPanelRoute = (route: PanelRoute, isBack = false) => {
    this.subRoutes = []
    this.panelRoute = route
    this.isBack = isBack
  }

  @action
  popSubroute = () => {
    this.subRoutes.shift()
    this.isBack = true
  }

  @action
  popSubrouteToRoot = (route?: SubRoute, isBack = true) => {
    this.subRoutes = []
    this.isBack = isBack

    if (route) {
      this.subRoutes.push(route)
    }
  }

  @action
  popSubrouteTo = (route: SubRoute, isBack = true) => {
    const index = this.subRoutes.indexOf(route)
    if (index === 0) {
      return
    }

    this.isBack = isBack
    if (index > 0) {
      this.subRoutes.splice(0, index)
    } else {
      this.subRoutes.shift()
      this.subRoutes.push(route)
    }
  }

  @action
  goToSubroute = (route: SubRoute) => {
    this.subRoutes.unshift(route)
    this.isBack = false
  }
}

export const routingStore = new RoutingStore()


import { observable, action } from 'mobx'

export interface RoutingProp {
  routing: RoutingStore
}

export type PanelRoute =
  | 'info'
  | 'settings'
  | 'home'
  | 'filters'
  | 'palette'

export class RoutingStore {
  constructor () {
    window.addEventListener('popstate', () => {
      this.isBack = true
    })
  }

  @observable panelRoute: PanelRoute = 'home'
  @observable isBack = false

  @action
  setPanelRoute = (route: PanelRoute, isBack = false) => {
    this.panelRoute = route
    this.isBack = isBack
  }
}

export const routingStore = new RoutingStore()

type HistoryFn = 'back' | 'forward' | 'go' | 'pushState' | 'replaceState'
function replaceHistoryFn<N extends HistoryFn> (name: N, isBack: boolean | ((...args: Parameters<History[N]>) => boolean)) {
  const orig = history[name]
  if (typeof isBack === 'function') {
    const isBackFn = isBack as Function
    history[name] = (...args: any[]) => {
      routingStore.isBack = isBackFn(...args)
      orig.call(history, ...args as [any, any])
    }
  } else {
    history[name] = (...args: any[]) => {
      routingStore.isBack = isBack
      orig.call(history, ...args as [any, any])
    }
  }
}

replaceHistoryFn('back', true)
replaceHistoryFn('forward', false)
replaceHistoryFn('go', (count) => !!count && count < 0)
replaceHistoryFn('pushState', false)
replaceHistoryFn('replaceState', false)

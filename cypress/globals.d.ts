
declare namespace Cypress {
  interface Chainable<Subject = any> {
    // elementExists(selector: string): Chainable<boolean>
    visible (selector?: string): Chainable<Subject>
    hideIntroPanels (): void
    showIntroPanels (): void
    goToPanelRoute (route: import('../site/state/routingStore').PanelRoute): void
    goToSubRoute (route: import('../site/state/routingStore').SubRoute): void
    patternSelected (pattern: string): void
    verifyMainRoute (route: import('../site/state/routingStore').PanelRoute, testid: string): void
    verifySubroute (route: import('../site/state/routingStore').SubRoute, testid: string): void
  }
}

interface Window {
  stores: import('../site/state/useStores').MobxStoresProps
}

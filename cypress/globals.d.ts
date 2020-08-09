
declare namespace Cypress {
  interface Chainable<Subject = any> {
    // elementExists(selector: string): Chainable<boolean>
    visible (selector?: string): Chainable<Subject>
    hideIntroPanels (): void
    showIntroPanels (): void
  }
}

interface Window {
  stores: import('../site/state/useStores').MobxStoresProps
}

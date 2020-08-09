// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function isWrapped<El extends HTMLElement> (el: JQuery<El> | El): el is JQuery<El> {
  return !!(el as JQuery<El>).jquery
}

function isChainable (el: any): el is Cypress.Chainable<any> {
  return !!el.then
}

function jQueryWrap<El extends HTMLElement> (el: JQuery<El> | El): JQuery<El> {
  if (!isWrapped(el)) {
    return Cypress.$(el)
  } else {
    return el
  }
}

function jQueryForce<El extends HTMLElement> (el: JQuery<El> | El | Cypress.Chainable<JQuery<El> | El>): Cypress.Chainable<JQuery<El>> {
  if (isChainable(el)) {
    return el.then(jQueryWrap)
  } else {
    return cy.wrap(jQueryWrap(el), { log: false })
  }
}

Cypress.Commands.add('visible', { prevSubject: 'optional' }, (
  subject?: JQuery<HTMLElement> | HTMLElement,
  selector?: string,
) => {
  let sub: Cypress.Chainable<JQuery<HTMLElement>>
  if (subject) {
    sub = jQueryForce(subject)

    if (selector) {
      sub = sub.find(selector, { log: false })
    }
  } else if (selector) {
    sub = cy.get(selector, { log: false })
  } else {
    Cypress.log({
      name: 'visible',
      displayName: 'Visible',
      message: selector || subject,
    }).finish()
    throw new Error('There must be a subject or a selector provided')
  }

  return sub.then($el => {
    const log = Cypress.log({
      $el,
      name: 'visible',
      displayName: 'Visible',
      message: selector || $el,
    })

    const style = getComputedStyle($el[0])
    const isNotTransparent = style.opacity !== '0'
    const isNotDisplayNone = style.display !== 'none'
    const hasJqueryVisibility = $el.is(':visible')
    const visible = isNotTransparent && isNotDisplayNone && hasJqueryVisibility

    log.set('consoleProps', () => ({
      'Opacity': style.opacity,
      'Display': style.display,
      'Has jQuery visibility': hasJqueryVisibility,
      'Result': visible,
    }))

    if (visible) {
      log.finish()
      return $el
    } else {
      log.finish()
      throw new Error(`Element ${$el.toString()} is not visible`)
    }
  })
})

Cypress.Commands.add('hideIntroPanels', () => {
  cy.window().its('stores').its('intro').invoke('_resolveAllPanels')
})

Cypress.Commands.add('showIntroPanels', () => {
  cy.window().its('stores').its('intro').invoke('_showPanels')
})

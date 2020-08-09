
import { elementExists } from '../../support/elementExists'
import { Page } from '../BasePage'

export class HowItWorksPanel extends Page<'Panel:HowItWorks'> {
  readonly name = 'Panel:HowItWorks'

  static verify () {
    return cy.get('[data-testid="how-it-works"]')
  }

  static verifySafe () {
    return elementExists('[data-testid="how-it-works"]')
  }

  static continue () {
    const selector = '[data-testid="how-it-works-button"]'
    cy.get('body', { log: false }).then($body => {
      if ($body.find(selector).length) {
        cy.get(selector).click()
        cy.window().its('stores').its('patterns').invoke('resetPattern')
      }
    })
  }
}

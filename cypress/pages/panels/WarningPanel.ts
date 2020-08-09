
import { elementExists } from '../../support/elementExists'
import { Page } from '../BasePage'

export class WarningPanel extends Page<'Panel:Warning'> {
  readonly name = 'Panel:Warning'

  static verify () {
    return cy.get('[data-testid="color-warning"]')
  }

  static verifySafe () {
    return elementExists('[data-testid="color-warning"]')
  }

  static continue () {
    const selector = '[data-testid="color-warning-button"]'
    cy.get('body', { log: false }).then($body => {
      if ($body.find(selector).length) {
        cy.get(selector).click()
        cy.window().its('stores').its('patterns').invoke('resetPattern')
      }
    })
  }
}

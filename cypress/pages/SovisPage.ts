
/// <reference types="cypress" />

import { Page } from './BasePage'

export class SovisPage extends Page<'SOVIS'> {
  readonly name = 'SOVIS'

  protected constructor () {
    super()
  }

  static visit () {
    cy.visit('/sovis')
    return Page.setCurrentPage(new SovisPage())
  }

  static verify () {
    cy.contains('Share Sound Color Project')
    return Page.setCurrentPage(new SovisPage())
  }

  static pauseColorSystem () {
    const selector = '[data-testid="shortcuts-pause"]'
    cy.get('body', { log: false }).then($body => {
      if ($body.find(selector).length) {
        cy.get(selector).click()
      }
    })
  }

  static playColorSystem () {
    const selector = '[data-testid="shortcuts-play"]'
    cy.get('body', { log: false }).then($body => {
      if ($body.find(selector).length) {
        cy.get(selector).click()
      }
    })
  }
}


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
}

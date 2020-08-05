
/// <reference types="cypress" />

import { Page } from './BasePage'

export class InfoPage extends Page<'Info'> {
  readonly name = 'Info'

  protected constructor () {
    super()
  }

  static visit () {
    cy.visit('/')
    return Page.setCurrentPage(new InfoPage())
  }

  static verify () {
    cy.contains('Exploring the relationships between audible and visual spectrums.')
    return Page.setCurrentPage(new InfoPage())
  }
}

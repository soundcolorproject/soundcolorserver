
/// <reference types="cypress" />

import { Then } from 'cypress-cucumber-preprocessor/steps'

Then('I should be on the color patterns panel', async () => {
  cy.get('[data-testid="pattern-selector"]')
  cy.window().its('stores').its('patterns').invoke('resetPattern')
})

Then('I should be on the saved color patterns panel', () => {
  cy.verifySubroute('favoriteCusom', 'saved-palette-selector')
})

Then('I should be on the custom color patterns panel', () => {
  cy.verifySubroute('customPalette', 'custom-pattern')
})

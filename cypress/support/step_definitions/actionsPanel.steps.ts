
/// <reference types="cypress" />

import { Then } from 'cypress-cucumber-preprocessor/steps'

Then('I should be on the actions panel', () => {
  cy.get('[data-testid="actions-panel"]')
})


/// <reference types="cypress" />

import { Then } from 'cypress-cucumber-preprocessor/steps'

Then('I should be on the options panel', async () => {
  cy.get('[data-testid="options-panel"]')
})

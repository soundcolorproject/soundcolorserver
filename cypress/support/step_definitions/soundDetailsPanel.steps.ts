
/// <reference types="cypress" />

import { Then } from 'cypress-cucumber-preprocessor/steps'

Then('I should be on the sound details panel', async () => {
  cy.get('[data-testid="sound-details"]')
})

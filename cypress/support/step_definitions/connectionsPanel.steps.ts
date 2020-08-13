
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the color patterns panel', async () => {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  cy.goToPanelRoute('palette')
})

Then('I should be on the connections panel', async () => {
  cy.get('[data-testid="connections-panel"]')
})

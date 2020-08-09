
/// <reference types="cypress" />

import { Given } from 'cypress-cucumber-preprocessor/steps'

Given('I am on the home panel', () => {
  cy.visit('/sovis')
  cy.hideIntroPanels()
})


/// <reference types="cypress" />

import { When } from 'cypress-cucumber-preprocessor/steps'

When('I click on {string}', (linkText) => {
  cy.get('body').find('button, a').contains(linkText).click()
})

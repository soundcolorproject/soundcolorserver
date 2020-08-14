
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

import { InfoPage } from '../../pages/InfoPage'

Given('I am on the info page', () => {
  InfoPage.visit()
})

Then('I should be on the info page', () => {
  cy.get('[data-testid="info-page"]')
})

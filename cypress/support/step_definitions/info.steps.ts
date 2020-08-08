
/// <reference types="cypress" />

import { Given, When } from 'cypress-cucumber-preprocessor/steps'

import { InfoPage } from '../../pages/InfoPage'

Given('I am on the info page', () => {
  InfoPage.visit()
})

When('I click on {string}', (linkText) => {
  cy.contains(linkText).click()
})

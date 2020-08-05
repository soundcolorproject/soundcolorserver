
/// <reference types="cypress" />

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

// import { InfoPage } from '../../pages/InfoPage'
// import { SovisPage } from '../../pages/SovisPage'

// console.log('heeeere')

Given('I am on the info page', () => {
  // console.log('foo')
})

When('I click on {string}', (linkText) => {
  // console.log('linkText', linkText)
  // cy.contains(linkText).click()
})

Then('I should be on the SOVIS page', () => {
  // console.log('bar')
})

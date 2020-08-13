
/// <reference types="cypress" />

import { Then, When } from 'cypress-cucumber-preprocessor/steps'

When('I click on {string}', (linkText) => {
  cy.get('body').find('button, a').contains(linkText).click()
})

Then('the {string} color pattern should play', (pattern: string) => {
  cy.patternSelected(pattern)
})

Then('I should be on the share panel', () => {
  cy.wait(300)
  cy.get('[data-testid="share-panel"]').then($el => {
    const style = getComputedStyle($el[0])
    if (parseFloat(style.height) === 0) {
      throw new Error('Expected the share panel to be shown, but instead was not')
    }
  })
})

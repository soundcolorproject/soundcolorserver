
/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

import { HomePanel } from '../../pages/panels/HomePanel'
import { HowItWorksPanel } from '../../pages/panels/HowItWorksPanel'
import { WarningPanel } from '../../pages/panels/WarningPanel'
import { SovisPage } from '../../pages/SovisPage'

Given('I am on the SOVIS page for the first time', () => {
  SovisPage.visit()
  cy.window().its('sessionStorage').invoke('clear')
  cy.reload()
})

Then('I should see the Warnings panel', () => {
  WarningPanel.verify()
})

Then('I should see the How It Works panel', () => {
  HowItWorksPanel.verify()
})

Then('I should see the Home panel', () => {
  HomePanel.verify()
})

Then('I should be on the SOVIS page', () => {
  SovisPage.verify()
})

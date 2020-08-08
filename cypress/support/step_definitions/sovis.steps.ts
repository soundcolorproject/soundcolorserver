
/// <reference types="cypress" />

import { Then } from 'cypress-cucumber-preprocessor/steps'

import { SovisPage } from '../../pages/SovisPage'

Then('I should be on the SOVIS page', () => {
  SovisPage.verify()
})


/// <reference types="cypress" />

import { Given } from 'cypress-cucumber-preprocessor/steps'

import { InfoPage } from '../../pages/InfoPage'

Given('I am on the info page', () => {
  InfoPage.visit()
})


/// <reference types="cypress" />

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

import { PanelRoute, SubRoute } from '../../../site/state/routingStore'

const allMainPanels: PanelRoute[] = [
  'actions',
  'connections',
  'home',
  'info',
  'options',
  'palette',
  'sound',
]

const allSubPanels: SubRoute[] = [
  'audioSource',
  'colorOptions',
  'cookiePolicy',
  'customPalette',
  'favoriteCusom',
  'hueConnectLocal',
  'hueGroupSelector',
  'timingOptions',
  'visualizationOptions',
]

function random<T> (opts: T[]): T {
  const randomIdx = Math.floor(Math.random() * opts.length)
  return opts[randomIdx]
}

function goToSubPanel () {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  const randomPanel = random(allMainPanels)
  const randomSubPanel = random(allSubPanels)
  cy.window().its('stores').its('routing').then(routing => {
    routing.setPanelRoute(randomPanel)
    routing.goToSubroute(randomSubPanel)
  })
}

function goToMainPanel () {
  cy.visit('/sovis')
  cy.hideIntroPanels()
  const randomPanel = random(allMainPanels)
  cy.window().its('stores').its('routing').then(routing => {
    routing.setPanelRoute(randomPanel)
  })
}

Given('I am on any main panel in SOVIS', goToMainPanel)

Given('I am on any sub-panel in SOVIS', goToSubPanel)

Given('I am on any panel in SOVIS', () => {
  if (Math.random() < 0.5) {
    goToMainPanel()
  } else {
    goToSubPanel()
  }
})

When('I click on the back icon', () => {
  cy.get('[data-testid="panel-back"]').click()
})

When('I click on the color patterns icon', () => {
  cy.get('[data-testid="panel-palette"]').click()
})

When('I click on the connections icon', () => {
  cy.get('[data-testid="panel-connections"]').click()
})

When('I click on the options icon', () => {
  cy.get('[data-testid="panel-options"]').click()
})

When('I click on the sound details icon', () => {
  cy.get('[data-testid="panel-sound"]').click()
})

When('I click on the actions icon', () => {
  cy.get('[data-testid="panel-actions"]').click()
})

Then('I should be on the home panel', () => {
  cy.window().its('stores').its('routing').then(routing => {
    if (routing.panelRoute !== 'home' || routing.subRoutes.length > 0) {
      throw new Error('Expected there to be no panel shown, but instead there was')
    }
  })
  cy.get('[data-testid="shrinking-side-panel"]').then($el => {
    const style = getComputedStyle($el[0])
    if (parseFloat(style.width) <= 48) {
      throw new Error('Expected there to be no panel shown, but instead there was')
    }
  })
})

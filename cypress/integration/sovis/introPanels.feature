
Feature: Start panels

Scenario: Warning panel
  Given I am on the SOVIS page for the first time
  Then I should see the Warnings panel

Scenario: How it works panel
  Given I am on the SOVIS page for the first time
  When I click on "Proceed"
  Then I should see the How It Works panel

Scenario: Home panel
  Given I am on the SOVIS page for the first time
  When I click on "Proceed"
  And I click on "Start SOVIS"
  Then I should see the Home panel


Feature: SOVIS panel

Scenario: I can get to the info page
  Given I am on the SOVIS panel
  When I click on "Sound Color Project"
  Then I should be on the info page

Scenario: I can get to the color patterns panel
  Given I am on the SOVIS panel
  When I click on "Color Patterns"
  Then I should be on the color patterns panel

Scenario: I can get to the connections panel
  Given I am on the SOVIS panel
  When I click on "Connections"
  Then I should be on the connections panel

Scenario: I can get to the options panel
  Given I am on the SOVIS panel
  When I click on "Options"
  Then I should be on the options panel

Scenario: I can get to the sound details panel
  Given I am on the SOVIS panel
  When I click on "Sound Details"
  Then I should be on the sound details panel

Scenario: I can get to the actions panel
  Given I am on the SOVIS panel
  When I click on "Actions"
  Then I should be on the actions panel

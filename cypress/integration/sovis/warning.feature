
Feature: Warning panel

Scenario: I can accept warning
  Given I am on the warning panel
  When I click on "Proceed"
  Then I should be on the how to panel

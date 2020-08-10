
Feature: Saved Color Patterns panel

Scenario: I can choose a saved color pattern
  Given I am on the saved color patterns panel
  When I click on any saved color pattern
  Then that color pattern should play
  And "Saved" on the color patterns should be highlighted

Scenario: I can delete a saved color pattern
  Given I am on the saved color patterns panel
  When I click on "Delete" for any saved color pattern
  Then that color pattern should be deleted

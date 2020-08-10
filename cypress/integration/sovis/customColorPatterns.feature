
Feature: Custom Color Pattern panel

Scenario: I can not reset any changes to the default custom color pattern
  Given I am on the custom color pattern panel
  And no changes have been made to the custom color pattern
  Then "Reset" should be disabled

Scenario: I can reset any changes to the default custom color pattern
  Given I am on the custom color pattern panel
  When I click on "Reset"
  Then the default custom color pattern should be restored

Scenario: I can save any changes to the default custom color pattern
  Given I am on the custom color pattern panel
  When I click on "Save"
  Then the current selected custom color pattern should be saved
  And that custom color pattern should appear in the saved panel
  And the number of saved custom color patterns should increase by 1

Scenario: I can choose a custom color
  Given I am on the custom color pattern panel
  When I click on any of the note options
  Then the color picker should appear

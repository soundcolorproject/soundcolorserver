
Feature: Options panel

Scenario: I can get to the color options panel
  Given I am on the options panel
  When I click on "Color"
  Then I should be on the color options panel

Scenario: I can get to the visualization options panel
  Given I am on the options panel
  When I click on "Visualization"
  Then I should be on the visualization options panel

Scenario: I can get to the timing options panel
  Given I am on the options panel
  When I click on "Timing"
  Then I should be on the timing options panel

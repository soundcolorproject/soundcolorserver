
Feature: Color Patterns panel

Scenario: I can get to the saved color patterns panel
  Given I am on the color patterns panel
  When I click on "Saved"
  Then I should be on the saved color patterns panel

Scenario: I can get to the custom color patterns panel
  Given I am on the color patterns panel
  When I click on "Custom"
  Then I should be on the custom color patterns panel
  And the "custom" color pattern should play

Scenario: I can play the chakras color pattern
  Given I am on the color patterns panel
  When I click on "Chakras"
  Then the "chakras" color pattern should play

Scenario: I can the chromesthesia color pattern
  Given I am on the color patterns panel
  When I click on "Chromesthesia"
  Then the "chromesthesia" color pattern should play

Scenario: I can the emotion color pattern
  Given I am on the color patterns panel
  When I click on "Emotion"
  Then the "emotion" color pattern should play

Scenario: I can the chromotherapy color pattern
  Given I am on the color patterns panel
  When I click on "Chromotherapy"
  Then the "chromotherapy" color pattern should play

Scenario: I can play the adolescence color pattern
  Given I am on the color patterns panel
  When I click on "Adolescence"
  Then the "adolescence" color pattern should play

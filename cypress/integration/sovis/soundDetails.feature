
Feature: Sound Details panel

@skip
Scenario: I can see the details of sound being analyzed
  Given I am on the sound details panel
  And SOVIS is playing
  Then the sound details numbers should be changing accordingly

@skip
Scenario: I can see the details of sound being analyzed
  Given I am on the sound details panel
  And SOVIS is not playing
  Then the sound details numbers should be blank

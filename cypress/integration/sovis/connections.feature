
Feature: Connections panel

Scenario: I can get to the audio source panel
  Given I am on the connections panel
  When I click on "Audio Source"
  Then I should be on the audio source panel

Scenario: I can get to the philips hue panel
  Given I am on the connections panel
  When I click on "Philips Hue"
  Then I should be on the philips hue panel

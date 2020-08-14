
Feature: Actions panel

@skip
Scenario: I can install SOVIS
  Given I am on the actions panel
  When I click on "Install SOVIS App"
  Then SOVIS should be installed on my device

@skip
Scenario: I can take a screenshot
  Given I am on the actions panel
  And SOVIS is playing
  When I click on "Take a Screenshot"
  Then the current frame of SOVIS should be downloaded

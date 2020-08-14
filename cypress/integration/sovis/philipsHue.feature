
Feature: Philips Hue panel

@skip
Scenario: I can login into philips hue
  Given I am on the philips hue panel
  And I am logged out
  When I click on "Accept"
  Then I should be taken to Philips Hue to login
  And I should arrive back on the philips hue panel

@skip
Scenario: I can go back from the philips hue panel
  Given I am on the philips hue panel
  And I am logged out
  When I click on "Go Back"
  Then I should be on the connections panel

@skip
Scenario: I can select a light group
  Given I am on the philips hue panel
  And I am logged in
  When I click "Start" on any available light group
  Then that light group should connect to SOVIS

@skip
Scenario: I can deselect a light group
  Given I am on the philips hue panel
  And I am logged in
  And a light group has been selected
  When I click on "Stop"
  Then that light group should disconnect to SOVIS

@skip
Scenario: I can logout of philips hue
  Given I am on the philips hue panel
  And I am logged in
  When I click on "Logout"
  Then I should be logged out
  And I should arrive on the connections panel

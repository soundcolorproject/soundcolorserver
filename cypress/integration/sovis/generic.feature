
Feature: Generic

Scenario: I can share SOVIS
  Given I am on any panel in SOVIS
  When I click on "Share Sound Color Project"
  Then I should be on the share panel

Scenario: I can play SOVIS
  Given I am on any panel in SOVIS
  When I click on the play icon
  Then SOVIS should start

Scenario: I can pause SOVIS
  Given I am on any panel in SOVIS
  And SOVIS is playing
  When I click on the pause icon
  Then SOVIS should pause

Scenario: I can hide the panel
  Given I am on any panel in SOVIS
  When I click on the eye icon
  Then the panel should disappear

Scenario: I can enter fullscreen mode
  Given I am on any panel in SOVIS
  When I click on the maximize icon
  Then SOVIS should enter fullscreen mode

Scenario: I can exit fullscreen mode
  Given I am on any panel in SOVIS
  And SOVIS is in fullscreen mode
  When I click on the minimize icon
  Then SOVIS should exit fullscreen mode

Scenario: I can get back
  Given I am on any panel in SOVIS
  When I click on the back icon
  Then I should navigate to the previous panel

Scenario: I can get to the color patterns panel
  Given I am on any panel in SOVIS
  When I click on the color patterns icon
  Then I should be on the color patterns panel

Scenario: I can get to the connections panel
  Given I am on any panel in SOVIS
  When I click on the connections icon
  Then I should be on the the connections panel

Scenario: I can get to the options panel
  Given I am on any panel in SOVIS
  When I click on the options icon
  Then I should be on the the options panel

Scenario: I can get to the sound details panel
  Given I am on any panel in SOVIS
  When I click on the sound details icon
  Then I should be on the the sound details panel

Scenario: I can get to the actions panel
  Given I am on any panel in SOVIS
  When I click on the actions icon
  Then I should be on the the actions panel

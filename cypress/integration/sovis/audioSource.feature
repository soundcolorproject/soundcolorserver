
Feature: Audio Source panel

@skip
Scenario: I can select an audio source
  Given I am on the audio source panel
  When I click on any available audio source
  Then that audio source should be selected

@skip
Scenario: I can see which audio source I have selected
  Given I am on the audio source panel
  And I have an audio source selected
  Then that audio source should be highlighted

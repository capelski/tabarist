
Feature: Beat engine

   The beat engine creates a continues stream of callbacks, with the frequency corresponding
   to the provided tempo
   
   Scenario: The first beat is processed when starting to play
      Given a beat engine with tempo 100
      When starting to play
      Then the onBeatUpdate handler has been called called 1 time(s)
      And the last rendered date is set to timestamp 100
      And beat 2 is scheduled via timeout 1 within 600ms

   Scenario: The second beat is processed when the schedule kicks in
      Given a beat engine with tempo 100
      When starting to play
      And the schedule for the beat 2 kicks in
      Then the onBeatUpdate handler has been called called 2 time(s)
      And the last rendered date is set to timestamp 200
      And beat 3 is scheduled via timeout 2 within 600ms

   Scenario: The tempo drives the beats schedule
      Given a beat engine with tempo 200
      When starting to play
      Then beat 2 is scheduled via timeout 1 within 300ms

   Scenario: The render delay is considered in the beats schedule
      Given a beat engine with tempo 100
      And a render delay of 17ms
      When starting to play
      Then beat 2 is scheduled via timeout 1 within 583ms

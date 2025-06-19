
Feature: Beat engine

   The beat engine creates a continues stream of callbacks, with the frequency corresponding
   to the provided tempo

   Scenario: The beat engine phase is updated on start
      Given a beat engine with tempo 100
      Then the beat engine is in phase "new"
      When starting to play
      When the beat engine is ready
      Then the beat engine is in phase "playing"
   
   Scenario: The first beat is processed when starting to play
      Given a beat engine with tempo 100
      When starting to play
      And the beat engine is ready
      Then the onBeatUpdate handler has been called called 1 time(s)
      And the last rendered date is set to timestamp 100
      And beat 2 is scheduled via timeout 1 within 600ms

   Scenario: The second beat is processed when the schedule kicks in
      Given a beat engine with tempo 100
      When starting to play
      And the beat engine is ready
      And the schedule element 1 kicks in
      Then the onBeatUpdate handler has been called called 2 time(s)
      And the last rendered date is set to timestamp 200
      And beat 3 is scheduled via timeout 2 within 600ms

   Scenario: The tempo drives the beats schedule
      Given a beat engine with tempo 200
      When starting to play
      And the beat engine is ready
      Then beat 2 is scheduled via timeout 1 within 300ms

   Scenario: The render delay is considered in the beats schedule
      Given a beat engine with tempo 100
      And a render delay of 17ms
      When starting to play
      And the beat engine is ready
      Then beat 2 is scheduled via timeout 1 within 583ms

   Scenario: Supports delayed start via countdown
      Given a beat engine with tempo 100
      When starting to play with countdown 3
      Then the beat engine is in phase "countdown"
      And the onBeatUpdate handler has been called called 0 time(s)
      When the schedule element 1 kicks in
      And the schedule element 2 kicks in
      And the schedule element 3 kicks in
      And the beat engine is ready
      Then the beat engine is in phase "playing"
      And the onCountdownUpdate handler has been called called 4 time(s)
      And the onBeatUpdate handler has been called called 1 time(s)

   Scenario: Supports youtube backing tracks
      Given a beat engine with tempo 100
      And a youtube track with id "youtube-id" at start 4000
      When starting to play
      Then the beat engine is in phase "initializing"
      Then the initializeYoutubePlayer handler has been called called 1 time(s)
      When the youtube player is initialized
      And the youtube track starts
      When the beat engine is ready
      Then the beat engine is in phase "playing"
      And the startYoutubeTrack handler has been called called 1 time(s)

   Scenario: Supports youtube backing tracks with countdown
      Given a beat engine with tempo 100
      And a youtube track with id "youtube-id" at start 4000
      When starting to play with countdown 3
      Then the beat engine is in phase "initializing"
      Then the initializeYoutubePlayer handler has been called called 1 time(s)
      When the youtube player is initialized
      Then the beat engine is in phase "countdown"
      And the startYoutubeTrack handler has been called called 0 time(s)
      When the schedule element 1 kicks in
      And the schedule element 2 kicks in
      And the schedule element 3 kicks in
      And the schedule element 4 kicks in
      And the youtube track starts
      And the beat engine is ready
      Then the beat engine is in phase "playing"
      And the startYoutubeTrack handler has been called called 1 time(s)

   Scenario: Cancels start operation when stopping during youtube initialization
      Given a beat engine with tempo 100
      And a youtube track with id "youtube-id" at start 4000
      When starting to play
      Then the beat engine is in phase "initializing"
      When stopping the beat engine
      When the youtube player is initialized
      And the beat engine is ready
      Then the startYoutubeTrack handler has been called called 0 time(s)
      And the beat engine is in phase "stopped"

   Scenario: The last interval of a countdown considers youtube track delay
      Given a beat engine with tempo 100
      And a youtube track with id "youtube-id" at start 4500
      When starting to play with countdown 1
      And the youtube player is initialized
      And the schedule element 1 kicks in
      Then the startYoutubeTrack handler has been called called 0 time(s)
      And the schedule element 2 kicks in
      Then the startYoutubeTrack handler has been called called 1 time(s)
      And the schedule element 2 is set with delay 500ms

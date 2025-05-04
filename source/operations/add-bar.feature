
Feature: Add bar

   Adds a bar to a list of bars, shifting to the left and reindexing the bars that
   come after

   Scenario: Adding a bar to a tab shifts later tabs to the left and reindexes them
      Given a tab "T"
      And a chord bar in tab "T"
      And a chord bar in tab "T"
      When adding to tab "T" a picking bar in position 2
      Then tab "T" has 3 bar(s)
      And the bar in position 1 in tab "T" is a chord bar
      And the bar in position 1 in tab "T" has index 0
      And the bar in position 2 in tab "T" is a picking bar
      And the bar in position 2 in tab "T" has index 1
      And the bar in position 3 in tab "T" is a chord bar
      And the bar in position 3 in tab "T" has index 2

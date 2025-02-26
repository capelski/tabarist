
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

   Scenario: Adding a chord bar to a tab without rhythms, creates one
      Given a tab "T"
      When adding to tab "T" a chord bar in position 1
      Then tab "T" has 1 rhythm(s)
      And the chord bar in position 1 in tab "T" uses the rhythm 1

   Scenario: Adding a chord bar to a tab with rhythms, uses the first one
      Given a tab "T"
      And a rhythm "R" in tab "T"
      Then tab "T" has 1 rhythm(s)
      When adding to tab "T" a chord bar in position 1
      And the chord bar in position 1 in tab "T" uses the rhythm 1

   Scenario: Adding a section bar to a tab without sections, creates one
      Given a tab "T"
      When adding to tab "T" a section bar in position 1
      Then tab "T" has 1 section(s)
      And the section bar in position 1 in tab "T" uses the section 1

   Scenario: Adding a section bar to a tab with sections, uses the first one
      Given a tab "T"
      And a section "S" in tab "T"
      When adding to tab "T" a section bar in position 1
      Then tab "T" has 1 section(s)
      And the section bar in position 1 in tab "T" uses the section 1

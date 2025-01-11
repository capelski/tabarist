
Feature: Move bar

   Moves a bar in a list of bars, shifting to the right and reindexing the bars that
   come after. It also updates the referenced indexes of reference bars in earlier positions

   Scenario: Moving a bar in a tab to an earlier position shifts tabs to the right and
   reindexes them, leaving earlier tabs unaffected
      Given a tab "T"
      And a chord bar in tab "T"
      And a chord bar in tab "T"
      And a picking bar in tab "T"
      When moving in tab "T" the bar in position 3 to position 2
      Then the bar in position 1 in tab "T" is a chord bar
      And the bar in position 1 in tab "T" has index 0
      And the bar in position 2 in tab "T" is a picking bar
      And the bar in position 2 in tab "T" has index 1
      And the bar in position 3 in tab "T" is a chord bar
      And the bar in position 3 in tab "T" has index 2

   Scenario: Moving a bar in a tab to a later position shifts tabs to the left and reindexes
   them, leaving earlier tabs unaffected
      Given a tab "T"
      And a chord bar in tab "T"
      And a picking bar in tab "T"
      And a chord bar in tab "T"
      When moving in tab "T" the bar in position 2 to position 4
      Then the bar in position 1 in tab "T" is a chord bar
      And the bar in position 1 in tab "T" has index 0
      And the bar in position 2 in tab "T" is a chord bar
      And the bar in position 2 in tab "T" has index 1
      And the bar in position 3 in tab "T" is a picking bar
      And the bar in position 3 in tab "T" has index 2

   Scenario: Moving a bar with references updates the referenced indexes
      Given a tab "T"
      And a chord bar in tab "T"
      And a reference bar in tab "T" pointing at the previous bar
      And a picking bar in tab "T"
      When moving in tab "T" the bar in position 1 to position 4
      Then the bar in position 1 in tab "T" is a reference bar
      And the bar in position 1 in tab "T" has index 0
      And the reference bar in position 1 in tab "T" points to index 2
      
   Scenario: Moving a reference bar to earlier than the referred bar updates the referenced indexes
      Given a tab "T"
      And a chord bar in tab "T"
      And a reference bar in tab "T" pointing at the previous bar
      When moving in tab "T" the bar in position 2 to position 1
      Then the bar in position 1 in tab "T" is a reference bar
      And the bar in position 1 in tab "T" has index 0
      And the reference bar in position 1 in tab "T" points to index 1
      
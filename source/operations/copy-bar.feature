
Feature: Copy bar

   Copies a bar in a list of bars, shifting to the right and reindexing the bars that
   come after. It also updates the referenced indexes of reference bars in earlier positions
   
   Scenario: Copying a bar creates a reference bar, shifting later bars to the right and reindexing them
      Given a tab "T"
      And a chord bar in tab "T"
      And a picking bar in tab "T"
      When copying in tab "T" the bar in position 1 to position 2
      Then tab "T" has 3 bar(s)
      And the bar in position 1 in tab "T" is a chord bar
      And the bar in position 1 in tab "T" has index 0
      And the bar in position 2 in tab "T" is a reference bar
      And the bar in position 2 in tab "T" has index 1
      And the reference bar in position 2 in tab "T" points to index 0
      And the bar in position 3 in tab "T" is a picking bar
      And the bar in position 3 in tab "T" has index 2

   Scenario: Copying a bar to an earlier position updates the referenced indexes
      Given a tab "T"
      And a chord bar in tab "T"
      When copying in tab "T" the bar in position 1 to position 1
      Then tab "T" has 2 bar(s)
      And the bar in position 1 in tab "T" is a reference bar
      And the bar in position 1 in tab "T" has index 0
      And the reference bar in position 1 in tab "T" points to index 1
      And the bar in position 2 in tab "T" is a chord bar
      And the bar in position 2 in tab "T" has index 1
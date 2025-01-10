
Feature: Remove bar

   Removes a bar from a list of bars and re-indexes the rest of bars accordingly

   Scenario: Removing a bar from a tab shifts bars to the right and reindexes them
      Given a tab "T"
      And a chord bar in tab "T"
      And a chord bar in tab "T"
      And a picking bar in tab "T"
      When removing from tab "T" the bar at position 2
      Then tab "T" has 2 bar(s)
      And the bar at position 1 in tab "T" is a chord bar
      And the bar at position 1 in tab "T" has index 0
      And the bar at position 2 in tab "T" is a picking bar
      And the bar at position 2 in tab "T" has index 1

   Scenario: Removing a bar from a section of a tab shifts bars to the right and reindexes them
      Given a tab "T"
      And a section "S" in tab "T"
      And a chord bar in section "S" of tab "T"
      And a chord bar in section "S" of tab "T"
      And a picking bar in section "S" of tab "T"
      When removing from section "S" of tab "T" the bar at position 2
      Then section "S" of tab "T" has 2 bar(s)
      And the bar at position 1 in section "S" of tab "T" is a chord bar
      And the bar at position 1 in section "S" of tab "T" has index 0
      And the bar at position 2 in section "S" of tab "T" is a picking bar
      And the bar at position 2 in section "S" of tab "T" has index 1

   Scenario: Removing a referenced bar from a tab should remove the references as well
      Given a tab "T"
      And a chord bar in tab "T"
      And a reference bar in tab "T" pointing at the previous bar
      And a picking bar in tab "T"
      When removing from tab "T" the bar at position 1
      Then tab "T" has 1 bar(s)
      And the bar at position 1 in tab "T" is a picking bar
      And the bar at position 1 in tab "T" has index 0

   Scenario: Removing a bar should update the referenced index on later reference bars
      Given a tab "T"
      And a chord bar in tab "T"
      And a picking bar in tab "T"
      And a reference bar in tab "T" pointing at the previous bar
      When removing from tab "T" the bar at position 1
      Then tab "T" has 2 bar(s)
      And the bar at position 1 in tab "T" is a picking bar
      And the bar at position 1 in tab "T" has index 0
      And the bar at position 2 in tab "T" is a reference bar
      And the bar at position 2 in tab "T" has index 1
      And the reference bar at position 2 in tab "T" points to index 0

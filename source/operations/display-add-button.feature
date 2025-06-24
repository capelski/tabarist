Feature: Display add button

    The add button is only displayed when appropriately

    Scenario: A chord bar displays the add button
        Given a chord bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1 has displayAddButton set to true

    Scenario: A picking bar displays the add button
        Given a picking bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1 has displayAddButton set to true

    Scenario: A reference bar displays the add button
        Given a chord bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2=1 has displayAddButton set to true

    Scenario: A reference bar for a section bar does NOT display the add button
        Given a section bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2=1 has displayAddButton set to false

    Scenario: A section bar displays the add button
        Given a section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1 has displayAddButton set to true

    Scenario: A chord bar displays the add button when inside a section
        Given a section bar with index 0
        And a chord bar with index 0 in section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1.1 has displayAddButton set to true

    Scenario: A picking bar displays the add button when inside a section
        Given a section bar with index 0
        And a picking bar with index 0 in section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1.1 has displayAddButton set to true

    Scenario: A reference bar displays the add button when inside a section
        Given a section bar with index 0
        And a chord bar with index 0 in section bar with index 0
        And a reference bar with index 1 for bar with index 0 in section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1.2=1.1 has displayAddButton set to true

        

Feature: Background color

    The background color of a bar header is set correctly

    Scenario: A chord bar has default background color
        Given a chord bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1 has backgroundColor set to default

    Scenario: A picking bar has default background color
        Given a picking bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1 has backgroundColor set to default

    Scenario: A reference bar has reference background color
        Given a chord bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2=1 has backgroundColor set to reference

    Scenario: A reference bar for a section bar has reference background color
        Given a section bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2=1 has backgroundColor set to reference

    Scenario: A section bar has section background color
        Given a section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1 has backgroundColor set to section

    Scenario: A chord bar has section background color when inside a section
        Given a section bar with index 0
        And a chord bar with index 0 in section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1.1 has backgroundColor set to section

    Scenario: A picking bar has section background color when inside a section
        Given a section bar with index 0
        And a picking bar with index 0 in section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1.1 has backgroundColor set to section

    Scenario: A reference bar has section background color when inside a section
        Given a section bar with index 0
        And a chord bar with index 0 in section bar with index 0
        And a reference bar with index 1 for bar with index 0 in section bar with index 0
        When transforming the bar with index 0
        Then the resulting bar container with displayIndex 1.2=1.1 has backgroundColor set to section

    Scenario: A chord bar has reference background color when inside a section reference
        Given a section bar with index 0
        And a chord bar with index 0 in section bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2.1 has backgroundColor set to reference

    Scenario: A picking bar has reference background color when inside a section reference
        Given a section bar with index 0
        And a picking bar with index 0 in section bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2.1 has backgroundColor set to reference

    Scenario: A reference bar has reference background color when inside a section reference
        Given a section bar with index 0
        And a chord bar with index 0 in section bar with index 0
        And a reference bar with index 1 for bar with index 0 in section bar with index 0
        And a reference bar with index 1 for bar with index 0
        When transforming the bar with index 1
        Then the resulting bar container with displayIndex 2.2=2.1 has backgroundColor set to reference

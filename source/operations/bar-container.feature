Feature: Bar containers

    The properties of a bar container are set according to their type

    Scenario: backgroundColor
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following backgroundColor property
            | standaloneChordBar               | default   |
            | standalonePickingBar             | default   |
            | standaloneReferenceBar           | reference |
            | standaloneReferenceBarForSection | reference |
            | sectionBar                       | section   |
            | inSectionChordBar                | section   |
            | inSectionPickingBar              | section   |
            | inSectionReferenceBar            | section   |
            | inSectionRefChordBar             | reference |
            | inSectionRefPickingBar           | reference |
            | inSectionRefReferenceBar         | reference |

    Scenario: canUpdate
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | standaloneChordBar                 | canUpdate | true  |
            | standalonePickingBar               | canUpdate | true  |
            | standaloneReferenceBar             | canUpdate | false |
            | standaloneReferenceBarForSection   | canUpdate | false |
            | sectionBar                         | canUpdate | true  |
            | inSectionChordBar                  | canUpdate | true  |
            | inSectionPickingBar                | canUpdate | true  |
            | inSectionReferenceBar              | canUpdate | false |
            | inSectionRefChordBar               | canUpdate | false |
            | inSectionRefPickingBar             | canUpdate | false |
            | inSectionRefReferenceBar           | canUpdate | false |

    Scenario: display
        Given every possible type of bar
        And edit mode set to false
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | standaloneChordBar                 | display | true  |
            | standalonePickingBar               | display | true  |
            | standaloneReferenceBar             | display | true  |
            | standaloneReferenceBarForSection   | display | false |
            | sectionBar                         | display | false |
            | inSectionChordBar                  | display | true  |
            | inSectionPickingBar                | display | true  |
            | inSectionReferenceBar              | display | true  |
            | inSectionRefChordBar               | display | true  |
            | inSectionRefPickingBar             | display | true  |
            | inSectionRefReferenceBar           | display | true  |

    Scenario: displayAddButton
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | standaloneChordBar                 | displayAddButton | true  |
            | standalonePickingBar               | displayAddButton | true  |
            | standaloneReferenceBar             | displayAddButton | true  |
            | standaloneReferenceBarForSection   | displayAddButton | false |
            | sectionBar                         | displayAddButton | true  |
            | inSectionChordBar                  | displayAddButton | true  |
            | inSectionPickingBar                | displayAddButton | true  |
            | inSectionReferenceBar              | displayAddButton | true  |
            | inSectionRefChordBar               | displayAddButton | false |
            | inSectionRefPickingBar             | displayAddButton | false |
            | inSectionRefReferenceBar           | displayAddButton | false |

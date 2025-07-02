Feature: Bar containers

    The properties of a bar container are set according to their type

    Scenario: addMode
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | standaloneChordBar                 | addMode | dualWithSection |
            | standalonePickingBar               | addMode | dualWithSection |
            | standaloneReferenceBar             | addMode | dualWithSection |
            | standaloneReferenceBarForSection   | addMode | none            |
            | sectionBar                         | addMode | none            |
            | inSectionChordBar                  | addMode | dual            |
            | inSectionPickingBar                | addMode | dual            |
            | inSectionReferenceBar              | addMode | dual            |
            | inSectionRefChordBar               | addMode | none            |
            | inSectionRefPickingBar             | addMode | none            |
            | inSectionRefReferenceBar           | addMode | none            |

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

    Scenario: displayRepeats
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | standaloneChordBar                 | displayRepeats | true  |
            | standalonePickingBar               | displayRepeats | true  |
            | standaloneReferenceBar             | displayRepeats | true  |
            | standaloneReferenceBarForSection   | displayRepeats | false |
            | sectionBar                         | displayRepeats | false |
            | inSectionChordBar                  | displayRepeats | true  |
            | inSectionPickingBar                | displayRepeats | true  |
            | inSectionReferenceBar              | displayRepeats | false |
            | inSectionRefChordBar               | displayRepeats | true  |
            | inSectionRefPickingBar             | displayRepeats | true |
            | inSectionRefReferenceBar           | displayRepeats | false |

    Scenario: displayRepeatsInput
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | standaloneChordBar                 | displayRepeatsInput | true  |
            | standalonePickingBar               | displayRepeatsInput | true  |
            | standaloneReferenceBar             | displayRepeatsInput | true  |
            | standaloneReferenceBarForSection   | displayRepeatsInput | true  |
            | sectionBar                         | displayRepeatsInput | true  |
            | inSectionChordBar                  | displayRepeatsInput | false |
            | inSectionPickingBar                | displayRepeatsInput | false |
            | inSectionReferenceBar              | displayRepeatsInput | false |
            | inSectionRefChordBar               | displayRepeatsInput | false |
            | inSectionRefPickingBar             | displayRepeatsInput | false |
            | inSectionRefReferenceBar           | displayRepeatsInput | false |

Feature: Bar containers

    The properties of a bar container are set according to their type

    Scenario: addMode
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | addMode | dualWithSection |
            | core_section_child              | addMode | dual            |
            | core_section_child_first        | addMode | dual            |
            | core_mirror_child               | addMode | none            |
            | core_mirror_child_first         | addMode | none            |
            | reference_standalone            | addMode | dualWithSection |
            | reference_section_child         | addMode | dual            |
            | reference_section_child_first   | addMode | dual            |
            | reference_mirror_child          | addMode | none            |
            | reference_mirror_child_first    | addMode | none            |
            | section_head                    | addMode | none            |
            | section_head_empty              | addMode | none            |
            | section_tail                    | addMode | none            |
            | mirror_head                     | addMode | none            |
            | mirror_head_empty               | addMode | none            |
            | mirror_tail                     | addMode | none            |

    Scenario: backgroundColor (view mode)
        Given every possible type of bar
        And edit mode set to false
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following backgroundColor property
            | core_standalone                 | default   |
            | core_section_child              | section   |
            | core_section_child_first        | section   |
            | core_mirror_child               | section   |
            | core_mirror_child_first         | section   |
            | reference_standalone            | default   |
            | reference_section_child         | section   |
            | reference_section_child_first   | section   |
            | reference_mirror_child          | section   |
            | reference_mirror_child_first    | section   |
            | section_head                    | default   |
            | section_head_empty              | default   |
            | section_tail                    | default   |
            | mirror_head                     | default   |
            | mirror_head_empty               | default   |
            | mirror_tail                     | default   |

    Scenario: backgroundColor (edit mode)
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following backgroundColor property
            | core_standalone                 | default   |
            | core_section_child              | section   |
            | core_section_child_first        | section   |
            | core_mirror_child               | reference |
            | core_mirror_child_first         | reference |
            | reference_standalone            | reference |
            | reference_section_child         | section   |
            | reference_section_child_first   | section   |
            | reference_mirror_child          | reference |
            | reference_mirror_child_first    | reference |
            | section_head                    | section   |
            | section_head_empty              | section   |
            | section_tail                    | section   |
            | mirror_head                     | reference |
            | mirror_head_empty               | reference |
            | mirror_tail                     | reference |

    Scenario: canUpdate
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | canUpdate | true  |
            | core_section_child              | canUpdate | true  |
            | core_section_child_first        | canUpdate | true  |
            | core_mirror_child               | canUpdate | false |
            | core_mirror_child_first         | canUpdate | false |
            | reference_standalone            | canUpdate | false |
            | reference_section_child         | canUpdate | false |
            | reference_section_child_first   | canUpdate | false |
            | reference_mirror_child          | canUpdate | false |
            | reference_mirror_child_first    | canUpdate | false |
            | section_head                    | canUpdate | true  |
            | section_head_empty              | canUpdate | true  |
            | section_tail                    | canUpdate | false |
            | mirror_head                     | canUpdate | false |
            | mirror_head_empty               | canUpdate | false |
            | mirror_tail                     | canUpdate | false |

    Scenario: display (view mode)
        Given every possible type of bar
        And edit mode set to false
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | display | true  |
            | core_section_child              | display | true  |
            | core_section_child_first        | display | true  |
            | core_mirror_child               | display | true  |
            | core_mirror_child_first         | display | true  |
            | reference_standalone            | display | true  |
            | reference_section_child         | display | true  |
            | reference_section_child_first   | display | true  |
            | reference_mirror_child          | display | true  |
            | reference_mirror_child_first    | display | true  |
            | section_head                    | display | false |
            | section_head_empty              | display | false |
            | section_tail                    | display | false |
            | mirror_head                     | display | false |
            | mirror_head_empty               | display | false |
            | mirror_tail                     | display | false |

    Scenario: displayIndex
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | displayIndex | 1       |
            | core_section_child              | displayIndex | 1.2     |
            | core_section_child_first        | displayIndex | 1.1     |
            | core_mirror_child               | displayIndex | 2.2     |
            | core_mirror_child_first         | displayIndex | 2.1     |
            | reference_standalone            | displayIndex | 2=1     |
            | reference_section_child         | displayIndex | 1.2=1.1 |
            | reference_section_child_first   | displayIndex | 1.1=1.2 |
            | reference_mirror_child          | displayIndex | 2.2=2.1 |
            | reference_mirror_child_first    | displayIndex | 2.1=2.2 |
            | section_head                    | displayIndex | 1       |
            | section_head_empty              | displayIndex | 1       |
            | section_tail                    | displayIndex | 1tail   |
            | mirror_head                     | displayIndex | 2=1     |
            | mirror_head_empty               | displayIndex | 2=1     |
            | mirror_tail                     | displayIndex | 2tail   |

    Scenario: displayRepeats (view mode)
        Given every possible type of bar
        And edit mode set to false
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | displayRepeats | true  |
            | core_section_child              | displayRepeats | false |
            | core_section_child_first        | displayRepeats | true  |
            | core_mirror_child               | displayRepeats | false |
            | core_mirror_child_first         | displayRepeats | true  |
            | reference_standalone            | displayRepeats | true  |
            | reference_section_child         | displayRepeats | false |
            | reference_section_child_first   | displayRepeats | true  |
            | reference_mirror_child          | displayRepeats | false |
            | reference_mirror_child_first    | displayRepeats | true  |
            | section_head                    | displayRepeats | false |
            | section_head_empty              | displayRepeats | false |
            | section_tail                    | displayRepeats | false |
            | mirror_head                     | displayRepeats | false |
            | mirror_head_empty               | displayRepeats | false |
            | mirror_tail                     | displayRepeats | false |

    Scenario: displayRepeats (edit mode)
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | displayRepeats | true  |
            | core_section_child              | displayRepeats | false |
            | core_section_child_first        | displayRepeats | true  |
            | core_mirror_child               | displayRepeats | false |
            | core_mirror_child_first         | displayRepeats | true  |
            | reference_standalone            | displayRepeats | true  |
            | reference_section_child         | displayRepeats | false |
            | reference_section_child_first   | displayRepeats | true  |
            | reference_mirror_child          | displayRepeats | false |
            | reference_mirror_child_first    | displayRepeats | true  |
            | section_head                    | displayRepeats | false |
            | section_head_empty              | displayRepeats | false |
            | section_tail                    | displayRepeats | false |
            | mirror_head                     | displayRepeats | false |
            | mirror_head_empty               | displayRepeats | false |
            | mirror_tail                     | displayRepeats | false |

    Scenario: repeatsBarIndex
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | repeatsBarIndex | 0         |
            | core_section_child              | repeatsBarIndex | undefined |
            | core_section_child_first        | repeatsBarIndex | 0         |
            | core_mirror_child               | repeatsBarIndex | undefined |
            | core_mirror_child_first         | repeatsBarIndex | 1         |
            | reference_standalone            | repeatsBarIndex | 1         |
            | reference_section_child         | repeatsBarIndex | undefined |
            | reference_section_child_first   | repeatsBarIndex | 0         |
            | reference_mirror_child          | repeatsBarIndex | undefined |
            | reference_mirror_child_first    | repeatsBarIndex | 1         |
            | section_head                    | repeatsBarIndex | undefined |
            | section_head_empty              | repeatsBarIndex | undefined |
            | section_tail                    | repeatsBarIndex | undefined |
            | mirror_head                     | repeatsBarIndex | undefined |
            | mirror_head_empty               | repeatsBarIndex | undefined |
            | mirror_tail                     | repeatsBarIndex | undefined |

    Scenario: repeatsValue
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | repeatsValue | 1         |
            | core_section_child              | repeatsValue | undefined |
            | core_section_child_first        | repeatsValue | 1         |
            | core_mirror_child               | repeatsValue | undefined |
            | core_mirror_child_first         | repeatsValue | 1         |
            | reference_standalone            | repeatsValue | 1         |
            | reference_section_child         | repeatsValue | undefined |
            | reference_section_child_first   | repeatsValue | 1         |
            | reference_mirror_child          | repeatsValue | undefined |
            | reference_mirror_child_first    | repeatsValue | 1         |
            | section_head                    | repeatsValue | undefined |
            | section_head_empty              | repeatsValue | undefined |
            | section_tail                    | repeatsValue | undefined |
            | mirror_head                     | repeatsValue | undefined |
            | mirror_head_empty               | repeatsValue | undefined |
            | mirror_tail                     | repeatsValue | undefined |

    Scenario: sectionName
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | sectionName | undefined |
            | core_section_child              | sectionName | undefined |
            | core_section_child_first        | sectionName | Name      |
            | core_mirror_child               | sectionName | undefined |
            | core_mirror_child_first         | sectionName | Name      |
            | reference_standalone            | sectionName | undefined |
            | reference_section_child         | sectionName | undefined |
            | reference_section_child_first   | sectionName | Name      |
            | reference_mirror_child          | sectionName | undefined |
            | reference_mirror_child_first    | sectionName | Name      |
            | section_head                    | sectionName | Name      |
            | section_head_empty              | sectionName | Name      |
            | section_tail                    | sectionName | undefined |
            | mirror_head                     | sectionName | Name      |
            | mirror_head_empty               | sectionName | Name      |
            | mirror_tail                     | sectionName | undefined |


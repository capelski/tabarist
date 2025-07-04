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
            | section_head                    | canUpdate | false |
            | section_head_empty              | canUpdate | false |
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

    Scenario: displayRepeatsInput (edit mode)
        Given every possible type of bar
        When transforming all bars to bar containers
        Then the corresponding bar containers have the following properties
            | core_standalone                 | displayRepeatsInput | true  |
            | core_section_child              | displayRepeatsInput | false |
            | core_section_child_first        | displayRepeatsInput | false |
            | core_mirror_child               | displayRepeatsInput | false |
            | core_mirror_child_first         | displayRepeatsInput | false |
            | reference_standalone            | displayRepeatsInput | true  |
            | reference_section_child         | displayRepeatsInput | false |
            | reference_section_child_first   | displayRepeatsInput | false |
            | reference_mirror_child          | displayRepeatsInput | false |
            | reference_mirror_child_first    | displayRepeatsInput | false |
            | section_head                    | displayRepeatsInput | true  |
            | section_head_empty              | displayRepeatsInput | true  |
            | section_tail                    | displayRepeatsInput | false |
            | mirror_head                     | displayRepeatsInput | true  |
            | mirror_head_empty               | displayRepeatsInput | true  |
            | mirror_tail                     | displayRepeatsInput | false |


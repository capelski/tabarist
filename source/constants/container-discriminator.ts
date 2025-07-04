export enum ContainerDiscriminator {
  // PickingBar and ChordBar scenarios
  core_standalone = 'core_standalone',
  core_section_child = 'core_section_child',
  core_section_child_first = 'core_section_child_first',
  core_mirror_child = 'core_mirror_child',
  core_mirror_child_first = 'core_mirror_child_first',

  // Reference scenarios
  reference_standalone = 'reference_standalone',
  reference_section_child = 'reference_section_child',
  reference_section_child_first = 'reference_section_child_first',
  reference_mirror_child = 'reference_mirror_child',
  reference_mirror_child_first = 'reference_mirror_child_first',

  // Section scenarios
  section_head = 'section_head',
  section_head_empty = 'section_head_empty',
  section_tail = 'section_tail',

  // Section reference (mirror) scenarios
  mirror_head = 'mirror_head',
  mirror_head_empty = 'mirror_head_empty',
  mirror_tail = 'mirror_tail',
}

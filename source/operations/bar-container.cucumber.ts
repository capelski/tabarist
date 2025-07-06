import { Before, DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType, ContainerDiscriminator, referenceColor, sectionColor } from '../constants';
import {
  Bar,
  BarContainer,
  ChordBar,
  NonSectionBar,
  PickingBar,
  ReferenceBar,
  SectionBar,
} from '../types';
import { barsToBarContainers, barToBarContainers } from './bar-container.operations';

let bars: Bar[] = [];
let barContainers: BarContainer[];
let isEditMode: boolean;

let barTypeScenarios: {
  [key in ContainerDiscriminator]: {
    bars: Bar[];
    barContainers: BarContainer[];
    targetBarContainer: BarContainer | undefined;
  };
};

Before(() => {
  bars = [];
  barContainers = [];
  barTypeScenarios = undefined!;
  isEditMode = true;
});

const createChordBar = (index: number): ChordBar => {
  return {
    index,
    repeats: 1,
    slots: [],
    type: BarType.chord,
    rhythmSlots: [],
  };
};

const createPickingBar = (index: number): PickingBar => {
  return {
    chordSupport: [],
    index,
    repeats: 1,
    strings: [],
    type: BarType.picking,
  };
};

const createReferenceBar = (index: number, barIndex: number): ReferenceBar => {
  return {
    barIndex,
    index,
    repeats: 1,
    type: BarType.reference,
  };
};

const createSectionBar = (index: number, bars: NonSectionBar[] = []): SectionBar => {
  return {
    bars,
    index,
    name: 'Name',
    repeats: 1,
    type: BarType.section,
  };
};

const addBarToSection = (bar: NonSectionBar, sectionBarIndex: number) => {
  const section = bars.find((b) => b.index === sectionBarIndex);
  if (section && section.type === BarType.section) {
    section.bars.push(bar);
  }
};

const getBackgroundColor = (cucumberValue: string) => {
  return cucumberValue === 'default'
    ? 'white'
    : cucumberValue === 'reference'
    ? referenceColor
    : sectionColor;
};

Given(/edit mode set to (true|false)/, (strValue: string) => {
  isEditMode = strValue === 'true';
});

Given('every possible type of bar', () => {
  barTypeScenarios = {
    // PickingBar and ChordBar scenarios
    [ContainerDiscriminator.core_standalone]: {
      bars: [createChordBar(0)],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.core_section_child]: {
      bars: [createSectionBar(0, [createPickingBar(0), createChordBar(1)])],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.core_section_child_first]: {
      bars: [createSectionBar(0, [createChordBar(0)])],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.core_mirror_child]: {
      bars: [
        createSectionBar(0, [createPickingBar(0), createChordBar(1)]),
        createReferenceBar(1, 0),
      ],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.core_mirror_child_first]: {
      bars: [createSectionBar(0, [createChordBar(0)]), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined,
    },

    // Reference scenarios
    [ContainerDiscriminator.reference_standalone]: {
      bars: [createChordBar(0), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.reference_section_child]: {
      bars: [createSectionBar(0, [createChordBar(0), createReferenceBar(1, 0)])],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.reference_section_child_first]: {
      bars: [createSectionBar(0, [createReferenceBar(0, 1), createChordBar(1)])],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.reference_mirror_child]: {
      bars: [
        createSectionBar(0, [createChordBar(0), createReferenceBar(1, 0)]),
        createReferenceBar(1, 0),
      ],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.reference_mirror_child_first]: {
      bars: [
        createSectionBar(0, [createReferenceBar(0, 1), createChordBar(1)]),
        createReferenceBar(1, 0),
      ],
      barContainers: [],
      targetBarContainer: undefined,
    },

    // Section scenarios
    [ContainerDiscriminator.section_head]: {
      bars: [createSectionBar(0, [createChordBar(1)])],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.section_head_empty]: {
      bars: [createSectionBar(0, [])],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.section_tail]: {
      bars: [createSectionBar(0, [])],
      barContainers: [],
      targetBarContainer: undefined,
    },

    // Section reference (mirror) scenarios
    [ContainerDiscriminator.mirror_head]: {
      bars: [createSectionBar(0, [createChordBar(1)]), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.mirror_head_empty]: {
      bars: [createSectionBar(0, []), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined,
    },
    [ContainerDiscriminator.mirror_tail]: {
      bars: [createSectionBar(0, []), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined,
    },
  };
});

Given('a chord bar with index {int}', (index: number) => {
  bars.push(createChordBar(index));
});

Given(
  'a chord bar with index {int} in section bar with index {int}',
  (index: number, sectionBarIndex: number) => {
    addBarToSection(createChordBar(index), sectionBarIndex);
  },
);

Given('a picking bar with index {int}', (index: number) => {
  bars.push(createPickingBar(index));
});

Given(
  'a picking bar with index {int} in section bar with index {int}',
  (index: number, sectionBarIndex: number) => {
    addBarToSection(createPickingBar(index), sectionBarIndex);
  },
);

Given(
  'a reference bar with index {int} for bar with index {int}',
  (index: number, barIndex: number) => {
    bars.push(createReferenceBar(index, barIndex));
  },
);

Given(
  'a reference bar with index {int} for bar with index {int} in section bar with index {int}',
  (index: number, barIndex: number, sectionBarIndex: number) => {
    addBarToSection(createReferenceBar(index, barIndex), sectionBarIndex);
  },
);

Given('a section bar with index {int}', (index: number) => {
  bars.push(createSectionBar(index));
});

When('transforming all bars to bar containers', () => {
  for (const key in barTypeScenarios) {
    barTypeScenarios[key as ContainerDiscriminator].barContainers = barsToBarContainers(
      barTypeScenarios[key as ContainerDiscriminator].bars,
      isEditMode,
    );

    barTypeScenarios[key as ContainerDiscriminator].targetBarContainer = barTypeScenarios[
      key as ContainerDiscriminator
    ].barContainers.find((c) => c.discriminator === key);
  }
});

When('transforming the bar with index {int}', (index: number) => {
  const bar = bars.find((b) => b.index === index)!;
  barContainers = barToBarContainers(
    bars,
    bar,
    isEditMode,
    { value: 0 },
    undefined,
    undefined,
  ).barContainers;
});

Then(
  /the resulting bar container with displayIndex (.+) has backgroundColor set to (default|reference|section)/,
  (displayIndex: string, expected: 'default' | 'reference' | 'section') => {
    const barContainer = barContainers.find((b) => b.displayIndex === displayIndex);
    const parsedExpected = getBackgroundColor(expected);
    expect(barContainer?.backgroundColor).to.equal(parsedExpected);
  },
);

Then('the corresponding bar containers have the following properties', (dataTable: DataTable) => {
  const data = dataTable.raw() as [ContainerDiscriminator, keyof BarContainer, string][];
  for (const [type, property, value] of data) {
    const target = barTypeScenarios[type].targetBarContainer;
    expect(String(target?.[property])).to.equal(
      value,
      `"${property}" on bar type ${type} (${target?.displayIndex}) did not equal ${value}`,
    );
  }
});

Then(
  'the corresponding bar containers have the following backgroundColor property',
  (dataTable: DataTable) => {
    const data = dataTable.raw() as [ContainerDiscriminator, string][];
    for (const [type, value] of data) {
      const target = barTypeScenarios[type].targetBarContainer;
      const symbolicTarget =
        target?.backgroundColor === sectionColor
          ? 'section'
          : target?.backgroundColor === referenceColor
          ? 'reference'
          : 'default';
      expect(symbolicTarget).to.equal(
        value,
        `"backgroundColor" on bar type ${type} (${target?.displayIndex}) did not equal ${value}`,
      );
    }
  },
);

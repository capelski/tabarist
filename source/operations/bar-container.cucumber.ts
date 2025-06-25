import { Before, DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType, referenceColor, sectionColor } from '../constants';
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

enum BarTypeScenarios {
  standaloneChordBar = 'standaloneChordBar',
  standalonePickingBar = 'standalonePickingBar',
  standaloneReferenceBar = 'standaloneReferenceBar',
  standaloneReferenceBarForSection = 'standaloneReferenceBarForSection',
  sectionBar = 'sectionBar',
  inSectionChordBar = 'inSectionChordBar',
  inSectionPickingBar = 'inSectionPickingBar',
  inSectionReferenceBar = 'inSectionReferenceBar',
  inSectionRefChordBar = 'inSectionRefChordBar',
  inSectionRefPickingBar = 'inSectionRefPickingBar',
  inSectionRefReferenceBar = 'inSectionRefReferenceBar',
}

let barTypeScenarios: {
  [key in BarTypeScenarios]: {
    bars: Bar[];
    barContainers: BarContainer[];
    targetBarContainer: BarContainer;
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
    repeats: undefined,
    slots: [],
    type: BarType.chord,
    rhythmSlots: [],
  };
};

const createPickingBar = (index: number): PickingBar => {
  return {
    chordSupport: [],
    index,
    repeats: undefined,
    strings: [],
    type: BarType.picking,
  };
};

const createReferenceBar = (index: number, barIndex: number): ReferenceBar => {
  return {
    barIndex,
    index,
    repeats: undefined,
    type: BarType.reference,
  };
};

const createSectionBar = (index: number, bars: NonSectionBar[] = []): SectionBar => {
  return {
    bars,
    index,
    name: 'Name',
    repeats: undefined,
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
    [BarTypeScenarios.standaloneChordBar]: {
      bars: [createChordBar(0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.standalonePickingBar]: {
      bars: [createPickingBar(0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.standaloneReferenceBar]: {
      bars: [createChordBar(0), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.standaloneReferenceBarForSection]: {
      bars: [createSectionBar(0), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.sectionBar]: {
      bars: [createSectionBar(0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.inSectionChordBar]: {
      bars: [createSectionBar(0, [createChordBar(0)])],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.inSectionPickingBar]: {
      bars: [createSectionBar(0, [createPickingBar(0)])],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.inSectionReferenceBar]: {
      bars: [createSectionBar(0, [createChordBar(0), createReferenceBar(1, 0)])],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.inSectionRefChordBar]: {
      bars: [createSectionBar(0, [createChordBar(0)]), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.inSectionRefPickingBar]: {
      bars: [createSectionBar(0, [createPickingBar(0)]), createReferenceBar(1, 0)],
      barContainers: [],
      targetBarContainer: undefined!,
    },
    [BarTypeScenarios.inSectionRefReferenceBar]: {
      bars: [
        createSectionBar(0, [createPickingBar(0), createReferenceBar(1, 0)]),
        createReferenceBar(1, 0),
      ],
      barContainers: [],
      targetBarContainer: undefined!,
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
    barTypeScenarios[key as BarTypeScenarios].barContainers = barsToBarContainers(
      barTypeScenarios[key as BarTypeScenarios].bars,
      isEditMode,
    );
  }

  barTypeScenarios[BarTypeScenarios.standaloneChordBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.standaloneChordBar].barContainers[0];

  barTypeScenarios[BarTypeScenarios.standalonePickingBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.standalonePickingBar].barContainers[0];

  barTypeScenarios[BarTypeScenarios.standaloneReferenceBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.standaloneReferenceBar].barContainers[1];

  barTypeScenarios[BarTypeScenarios.standaloneReferenceBarForSection].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.standaloneReferenceBarForSection].barContainers[2];

  barTypeScenarios[BarTypeScenarios.sectionBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.sectionBar].barContainers[0];

  barTypeScenarios[BarTypeScenarios.inSectionChordBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.inSectionChordBar].barContainers[1];

  barTypeScenarios[BarTypeScenarios.inSectionPickingBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.inSectionPickingBar].barContainers[1];

  barTypeScenarios[BarTypeScenarios.inSectionReferenceBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.inSectionReferenceBar].barContainers[2];

  barTypeScenarios[BarTypeScenarios.inSectionRefChordBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.inSectionRefChordBar].barContainers[4];

  barTypeScenarios[BarTypeScenarios.inSectionRefPickingBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.inSectionRefPickingBar].barContainers[4];

  barTypeScenarios[BarTypeScenarios.inSectionRefReferenceBar].targetBarContainer =
    barTypeScenarios[BarTypeScenarios.inSectionRefReferenceBar].barContainers[6];
});

When('transforming the bar with index {int}', (index: number) => {
  const bar = bars.find((b) => b.index === index)!;
  barContainers = barToBarContainers(bars, bar, isEditMode, { value: 0 }, undefined).barContainers;
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
  const data = dataTable.raw() as [BarTypeScenarios, keyof BarContainer, string][];
  for (const [type, property, value] of data) {
    const target = barTypeScenarios[type].targetBarContainer;
    expect(String(target[property])).to.equal(
      value,
      `"${property}" on bar type ${type} (${target.displayIndex}) did not equal ${value}`,
    );
  }
});

Then(
  'the corresponding bar containers have the following backgroundColor property',
  (dataTable: DataTable) => {
    const data = dataTable.raw() as [BarTypeScenarios, string][];
    for (const [type, value] of data) {
      const target = barTypeScenarios[type].targetBarContainer;
      expect(String(target.backgroundColor)).to.equal(
        getBackgroundColor(value),
        `"backgroundColor" on bar type ${type} (${target.displayIndex}) did not equal ${value}`,
      );
    }
  },
);

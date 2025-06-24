import { Before, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType } from '../constants';
import {
  Bar,
  BarContainer,
  ChordBar,
  NonSectionBar,
  PickingBar,
  ReferenceBar,
  SectionBar,
} from '../types';
import { barToBarContainers } from './bar-container.operations';

let bars: Bar[] = [];
let barContainers: BarContainer[];
let isEditMode: boolean;

Before(() => {
  bars = [];
  barContainers = [];
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

const addBarToSection = (bar: NonSectionBar, sectionBarIndex: number) => {
  const section = bars.find((b) => b.index === sectionBarIndex);
  if (section && section.type === BarType.section) {
    section.bars.push(bar);
  }
};

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
  const sectionBar: SectionBar = {
    bars: [],
    index,
    name: 'Name',
    repeats: undefined,
    type: BarType.section,
  };
  bars.push(sectionBar);
});

When('transforming the bar with index {int}', (index: number) => {
  const bar = bars.find((b) => b.index === index)!;
  barContainers = barToBarContainers(bars, bar, isEditMode, { value: 0 }, undefined).barContainers;
});

Then(
  /the resulting bar container with displayIndex (.+) has displayAddButton set to (true|false)/,
  (displayIndex: string, result: string) => {
    const barContainer = barContainers.find((b) => b.displayIndex === displayIndex);
    const parsedResult = result === 'true';
    expect(barContainer?.displayAddButton).to.equal(parsedResult);
  },
);

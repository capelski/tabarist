import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType, NonReferenceBarType } from '../constants';
import { globals } from '../test-globals.cucumber';
import { ChordBar, PositionOperation, ReferenceBar, SectionBar } from '../types';
import { tabOperations } from './tab.operations';

Given(
  /^a (chord|picking|section) bar in (section "(.*)" of )?tab "(.*)"/,
  function (type: NonReferenceBarType, sectionName: string, tabName: string) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;
    const bars = section?.bars ?? globals.tabs[tabName].bars;

    globals.tabs[tabName] = tabOperations.addBar(globals.tabs[tabName], bars.length, type, section);
  },
);

Given(/^a reference bar in tab "(.*)" pointing at the previous bar/, function (tabName: string) {
  const copying: PositionOperation = {
    sectionIndex: undefined,
    startIndex: globals.tabs[tabName].bars.length - 1,
    type: 'copying',
  };

  globals.tabs[tabName] = tabOperations.copyBar(
    globals.tabs[tabName],
    globals.tabs[tabName].bars.length,
    copying,
  );
});

Then(
  /^the bar in position (\d+) in (section "(.*)" of )?tab "(.*)" is a (chord|picking|reference|section) bar/,
  function (position: number, sectionName: string, tabName: string, type: BarType) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;
    const bars = section?.bars ?? globals.tabs[tabName].bars;
    const bar = bars[position - 1];
    expect(bar.type).to.equal(type);
  },
);

Then(
  /^the bar in position (\d+) in (section "(.*)" of )?tab "(.*)" has index (\d+)/,
  function (position: number, sectionName: string, tabName: string, index: number) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;
    const bars = section?.bars ?? globals.tabs[tabName].bars;
    const bar = bars[position - 1];
    expect(bar.index).to.equal(index);
  },
);

Then(
  /^the chord bar in position (\d+) in tab "(.*)" uses the rhythm (\d+)/,
  function (position: number, tabName: string, rhythmPosition: number) {
    const bar = globals.tabs[tabName].bars[position - 1];
    expect(bar.type).to.equal(BarType.chord);
    expect((bar as ChordBar).rhythmIndex).to.equal(rhythmPosition - 1);
  },
);

Then(
  /^the reference bar in position (\d+) in tab "(.*)" points to index (\d+)/,
  function (position: number, tabName: string, referredIndex: number) {
    const bar = globals.tabs[tabName].bars[position - 1];
    expect(bar.type).to.equal(BarType.reference);
    expect((bar as ReferenceBar).barIndex).to.equal(referredIndex);
  },
);

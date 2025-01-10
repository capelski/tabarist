import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType } from '../constants';
import { ReferenceBar } from '../types';
import { tabOperations } from './tab.operations';
import { globals } from './test-globals.cucumber';

Given(
  /^a (chord|picking) bar in (section "(.*)" of )?tab "(.*)"/,
  function (type: BarType, sectionName: string, tabName: string) {
    const section = globals.tabs[tabName].sections.find((s) => s.name === sectionName);
    const bars = section?.bars ?? globals.tabs[tabName].bars;

    globals.tabs[tabName] = tabOperations.addBar(globals.tabs[tabName], bars.length, type, section);
  },
);

Given(/^a reference bar in tab "(.*)" pointing at the previous bar/, function (tabName: string) {
  globals.tabs[tabName] = tabOperations.addBar(
    globals.tabs[tabName],
    globals.tabs[tabName].bars.length - 1,
    BarType.reference,
  );
});

Then(
  /^the bar at position (\d+) in (section "(.*)" of )?tab "(.*)" is a (chord|reference|picking) bar/,
  function (position: number, sectionName: string, tabName: string, type: BarType) {
    const section = globals.tabs[tabName].sections.find((s) => s.name === sectionName);
    const bars = section?.bars ?? globals.tabs[tabName].bars;
    const bar = bars[position - 1];
    expect(bar.type).to.equal(type);
  },
);

Then(
  /^the bar at position (\d+) in (section "(.*)" of )?tab "(.*)" has index (\d+)/,
  function (position: number, sectionName: string, tabName: string, index: number) {
    const section = globals.tabs[tabName].sections.find((s) => s.name === sectionName);
    const bars = section?.bars ?? globals.tabs[tabName].bars;
    const bar = bars[position - 1];
    expect(bar.index).to.equal(index);
  },
);

Then(
  /^the reference bar at position (\d+) in tab "(.*)" points to index (\d+)/,
  function (position: number, tabName: string, referredIndex: number) {
    const bar = globals.tabs[tabName].bars[position - 1];
    expect(bar.type === BarType.reference).to.be.true;
    expect((bar as ReferenceBar).barIndex).to.equal(referredIndex);
  },
);

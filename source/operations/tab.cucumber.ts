import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType, NonReferenceBarType } from '../constants';
import { SectionBar } from '../types';
import { tabOperations } from './tab.operations';
import { globals } from './test-globals.cucumber';

Given(/^a tab "(.*)"/, function (tabName: string) {
  globals.tabs[tabName] = tabOperations.create('owner');
});

Given(/^a rhythm "(.*)" in tab "(.*)"/, function (rhythmName: string, tabName: string) {
  globals.tabs[tabName] = tabOperations.addRhythm(globals.tabs[tabName]);
  globals.tabs[tabName] = tabOperations.renameRhythm(
    globals.tabs[tabName],
    globals.tabs[tabName].rhythms.length - 1,
    rhythmName,
  );
});

When(
  /^adding to (section "(.*)" of )?tab "(.*)" a (chord|picking|section) bar in position (\d+)/,
  function (sectionName: string, tabName: string, type: NonReferenceBarType, position: number) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;

    globals.tabs[tabName] = tabOperations.addBar(
      globals.tabs[tabName],
      position - 1,
      type,
      section,
    );
  },
);

When(
  /^copying in (section "(.*)" of )?tab "(.*)" the bar in position (\d+) to position (\d+)/,
  function (sectionName: string, tabName: string, startPosition: number, endPosition: number) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;

    globals.tabs[tabName] = tabOperations.copyBarStart(
      globals.tabs[tabName],
      startPosition - 1,
      section?.index,
    );
    globals.tabs[tabName] = tabOperations.copyBarEnd(
      globals.tabs[tabName],
      endPosition - 1,
      section,
    );
  },
);

When(
  /^removing from (section "(.*)" of )?tab "(.*)" the bar in position (\d+)/,
  function (sectionName: string, tabName: string, position: number) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;

    globals.tabs[tabName] = tabOperations.removeBar(globals.tabs[tabName], position - 1, section);
  },
);

When(
  /^moving in (section "(.*)" of )?tab "(.*)" the bar in position (\d+) to position (\d+)/,
  function (sectionName: string, tabName: string, startPosition: number, endPosition: number) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;

    globals.tabs[tabName] = tabOperations.moveBarStart(
      globals.tabs[tabName],
      startPosition - 1,
      section?.index,
    );
    globals.tabs[tabName] = tabOperations.moveBarEnd(
      globals.tabs[tabName],
      endPosition - 1,
      section,
    );
  },
);

Then(
  /^(section "(.*)" of )?tab "(.*)" has (\d+) bar\(s\)/,
  function (sectionName: string, tabName: string, count: number) {
    const section = globals.tabs[tabName].bars.find(
      (b) => b.type === BarType.section && b.name === sectionName,
    ) as SectionBar;
    const bars = section?.bars ?? globals.tabs[tabName].bars;
    expect(bars).to.have.length(count);
  },
);

Then(/^tab "(.*)" has (\d*) rhythm\(s\)/, function (tabName: string, count: number) {
  expect(globals.tabs[tabName].rhythms).to.have.length(count);
});

Then(/^tab "(.*)" has (\d*) section\(s\)/, function (tabName: string, count: number) {
  const sections = globals.tabs[tabName].bars.filter((b) => b.type === BarType.section);
  expect(sections).to.have.length(count);
});

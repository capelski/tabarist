import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BarType } from '../constants';
import { tabOperations } from './tab.operations';
import { globals } from './test-globals.cucumber';

Given(/^a tab "(.*)"/, function (tabName: string) {
  globals.tabs[tabName] = tabOperations.create();
});

Given(/^a section "(.*)" in tab "(.*)"/, function (sectionName: string, tabName: string) {
  globals.tabs[tabName] = tabOperations.addSection(globals.tabs[tabName]);
  globals.tabs[tabName] = tabOperations.renameSection(
    globals.tabs[tabName],
    globals.tabs[tabName].sections.length - 1,
    sectionName,
  );
});

Given(
  /^a strumming pattern "(.*)" in tab "(.*)"/,
  function (sPatternName: string, tabName: string) {
    globals.tabs[tabName] = tabOperations.addStrummingPattern(globals.tabs[tabName]);
    globals.tabs[tabName] = tabOperations.renameStrummingPattern(
      globals.tabs[tabName],
      globals.tabs[tabName].strummingPatterns.length - 1,
      sPatternName,
    );
  },
);

When(
  /^adding to (section "(.*)" of )?tab "(.*)" a (chord|picking|reference|section) bar in position (\d+)/,
  function (sectionName: string, tabName: string, type: BarType, position: number) {
    const section = globals.tabs[tabName].sections.find((s) => s.name === sectionName);

    globals.tabs[tabName] = tabOperations.addBar(
      globals.tabs[tabName],
      position - 1,
      type,
      section,
    );
  },
);

When(
  /^removing from (section "(.*)" of )?tab "(.*)" the bar at position (\d+)/,
  function (sectionName: string, tabName: string, position: number) {
    const section = globals.tabs[tabName].sections.find((s) => s.name === sectionName);

    globals.tabs[tabName] = tabOperations.removeBar(globals.tabs[tabName], position - 1, section);
  },
);

Then(
  /^(section "(.*)" of )?tab "(.*)" has (\d+) bar\(s\)/,
  function (sectionName: string, tabName: string, count: number) {
    const section = globals.tabs[tabName].sections.find((s) => s.name === sectionName);
    const bars = section?.bars ?? globals.tabs[tabName].bars;
    expect(bars).to.have.length(count);
  },
);

Then(/^tab "(.*)" has (\d*) strumming pattern\(s\)/, function (tabName: string, count: number) {
  expect(globals.tabs[tabName].strummingPatterns).to.have.length(count);
});

Then(/^tab "(.*)" has (\d*) section\(s\)/, function (tabName: string, count: number) {
  expect(globals.tabs[tabName].sections).to.have.length(count);
});

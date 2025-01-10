import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
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
    expect(bars.length).to.equal(count);
  },
);

import { BarType } from '../constants';
import { Bar, BarContainer, ChordBar, PickingBar, Tab } from '../types';

export const barsToBarContainers = (
  tab: Tab,
  bars: Bar[],
  {
    inSection,
    inSectionBar,
    sectionOffset,
  }: {
    inSection?: BarContainer['inSection'];
    inSectionBar?: BarContainer['inSectionBar'];
    sectionOffset?: number;
  } = {},
): BarContainer[] => {
  const { barContainers } = bars.reduce<{
    barContainers: BarContainer[];
    lastChordBar: ChordBar | undefined;
  }>(
    (reduced, bar) => {
      const position = reduced.barContainers.length + (sectionOffset ?? 0);
      const isFirstInSectionBar = !!inSectionBar && bar.index === 0;
      const isLastInSectionBar = !!inSectionBar && bar.index === bars.length - 1;

      const nextBarContainers = [...reduced.barContainers];
      let nextChordBar = reduced.lastChordBar;

      if (bar.type === BarType.chord || bar.type === BarType.picking) {
        nextBarContainers.push({
          inSection: inSection,
          inSectionBar: inSectionBar,
          isFirstInSectionBar,
          isLastInSectionBar,
          isReference: false,
          omitStrummingPattern:
            bar.type === BarType.chord && bar.sPatternIndex === reduced.lastChordBar?.sPatternIndex,
          originalBar: inSectionBar?.bar || bar,
          position,
          positionOfFirstBar: sectionOffset,
          renderedBar: bar,
        });

        if (bar.type === BarType.chord) {
          nextChordBar = bar;
        }
      } else if (bar.type === BarType.reference) {
        const referencedBar = bars.find((b) => b.index === bar.barIndex) as ChordBar | PickingBar;

        nextBarContainers.push({
          inSection: inSection,
          inSectionBar: inSectionBar,
          isFirstInSectionBar,
          isLastInSectionBar,
          isReference: true,
          omitStrummingPattern:
            referencedBar.type === BarType.chord &&
            referencedBar.sPatternIndex === reduced.lastChordBar?.sPatternIndex,
          originalBar: inSectionBar?.bar || bar,
          position,
          positionOfFirstBar: sectionOffset,
          renderedBar: referencedBar,
        });

        if (referencedBar.type === BarType.chord) {
          nextChordBar = referencedBar;
        }
      } else {
        const section = tab.sections.find((section) => bar.sectionIndex === section.index)!;

        if (section.bars.length === 0) {
          nextBarContainers.push({
            inSection: undefined,
            inSectionBar: {
              bar,
              referredSection: section,
            },
            isFirstInSectionBar: true,
            isLastInSectionBar: true,
            isReference: false,
            omitStrummingPattern: true,
            originalBar: bar,
            position,
            positionOfFirstBar: sectionOffset,
            renderedBar: undefined,
          });
        } else {
          nextBarContainers.push(
            ...barsToBarContainers(tab, section.bars, {
              inSectionBar: {
                bar,
                referredSection: section,
              },
              sectionOffset: position,
            }),
          );
        }
      }

      return {
        barContainers: nextBarContainers,
        lastChordBar: nextChordBar,
      };
    },
    { barContainers: [], lastChordBar: undefined },
  );

  return barContainers;
};

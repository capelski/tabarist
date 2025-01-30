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
  return bars.reduce<BarContainer[]>((reduced, bar) => {
    const barContainers = [...reduced];

    const position = reduced.length + (sectionOffset ?? 0);
    const isFirstInSectionBar = !!inSectionBar && bar.index === 0;
    const isLastInSectionBar = !!inSectionBar && bar.index === bars.length - 1;

    if (bar.type === BarType.chord || bar.type === BarType.picking) {
      barContainers.push({
        inSection: inSection,
        inSectionBar: inSectionBar,
        isFirstInSectionBar,
        isLastInSectionBar,
        isReference: false,
        originalBar: inSectionBar?.bar || bar,
        position,
        positionOfFirstBar: sectionOffset,
        renderedBar: bar,
      });
    } else if (bar.type === BarType.reference) {
      const referencedBar = bars.find((b) => b.index === bar.barIndex) as ChordBar | PickingBar;

      barContainers.push({
        inSection: inSection,
        inSectionBar: inSectionBar,
        isFirstInSectionBar,
        isLastInSectionBar,
        isReference: true,
        originalBar: inSectionBar?.bar || bar,
        position,
        positionOfFirstBar: sectionOffset,
        renderedBar: referencedBar,
      });
    } else {
      const section = tab.sections.find((section) => bar.sectionIndex === section.index)!;

      if (section.bars.length === 0) {
        barContainers.push({
          inSection: undefined,
          inSectionBar: {
            bar,
            referredSection: section,
          },
          isFirstInSectionBar: true,
          isLastInSectionBar: true,
          isReference: false,
          originalBar: bar,
          position,
          positionOfFirstBar: sectionOffset,
          renderedBar: undefined,
        });
      } else {
        barContainers.push(
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

    return barContainers;
  }, []);
};

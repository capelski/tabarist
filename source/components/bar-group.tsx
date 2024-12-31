import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { BarType, stringHeight } from '../constants';
import {
  createChordBar,
  createPickingBar,
  createReferenceBar,
  createSectionBar,
  sectionOperations,
  tabOperations,
} from '../operations';
import { Bar, ChordBar, NonSectionBar, PickingBar, Section, Tab } from '../types';
import { AddBar } from './add-bar';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';
import { ReferenceBarComponent } from './reference-bar';
import { SectionBarComponent } from './section-bar';

export type BarGroupProps = {
  addStrummingPattern: () => void;
  bars: Bar[];
  isEditMode: boolean;
  inSection?: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
  const isBigScreen = useMediaQuery({ minWidth: 1000 });
  const isMediumScreen = useMediaQuery({ minWidth: 600 });
  const barWidth = isBigScreen ? 25 : isMediumScreen ? 50 : 100;

  const addBar = (index: number, type: BarType.chord | BarType.picking | BarType.section) => {
    const bar =
      type === BarType.chord
        ? createChordBar(index, props.tab.strummingPatterns[0])
        : type === BarType.picking
        ? createPickingBar(index)
        : createSectionBar(index, props.tab.sections[0]);

    const nextTab = props.inSection
      ? sectionOperations.addBar(props.tab, props.inSection.index, bar as NonSectionBar)
      : tabOperations.addBar(props.tab, bar);

    props.updateTab(nextTab);
  };

  return (
    <div
      className="bars"
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
    >
      {props.bars.map((bar) => {
        const copyBar = () => {
          const newBar = createReferenceBar(bar);

          const nextTab = props.inSection
            ? sectionOperations.addBar(props.tab, props.inSection.index, newBar)
            : tabOperations.addBar(props.tab, newBar);

          props.updateTab(nextTab);
        };

        const removeBar = () => {
          const nextTab = props.inSection
            ? sectionOperations.removeBar(props.tab, props.inSection.index, bar.index)
            : tabOperations.removeBar(props.tab, bar.index);

          props.updateTab(nextTab);
        };

        const baseProps = {
          addBar: (type: BarType.chord | BarType.picking | BarType.section) => {
            addBar(bar.index, type);
          },
          isEditMode: props.isEditMode,
          removeBar,
          width: barWidth,
        };

        const nonSectionProps = {
          ...baseProps,
          copyBar,
          inSection: props.inSection,
        };

        const section = props.tab.sections.find(
          (section) =>
            section.index ===
            (bar.type === BarType.section ? bar.sectionIndex : bar.inSectionIndex),
        );

        return (
          <React.Fragment key={bar.index}>
            {bar.type === BarType.chord ? (
              <ChordBarComponent
                {...nonSectionProps}
                addStrummingPattern={props.addStrummingPattern}
                bar={bar}
                rebase={(sPatternIndex) => {
                  const nextTab = props.inSection
                    ? sectionOperations.rebaseChordBar(
                        props.tab,
                        props.inSection.index,
                        bar.index,
                        sPatternIndex,
                      )
                    : tabOperations.rebaseChordBar(props.tab, bar.index, sPatternIndex);

                  props.updateTab(nextTab);
                }}
                strummingPatterns={props.tab.strummingPatterns}
                updateFrame={(frameIndex, value) => {
                  const nextTab = props.inSection
                    ? sectionOperations.updateChordFrame(
                        props.tab,
                        props.inSection.index,
                        bar.index,
                        frameIndex,
                        value,
                      )
                    : tabOperations.updateChordFrame(props.tab, bar.index, frameIndex, value);

                  props.updateTab(nextTab);
                }}
              />
            ) : bar.type === BarType.picking ? (
              <PickingBarComponent
                {...nonSectionProps}
                bar={bar}
                rebase={(framesNumber) => {
                  const nextTab = props.inSection
                    ? sectionOperations.rebasePickingBar(
                        props.tab,
                        props.inSection.index,
                        bar.index,
                        framesNumber,
                      )
                    : tabOperations.rebasePickingBar(props.tab, bar.index, framesNumber);

                  props.updateTab(nextTab);
                }}
                updateFrame={(frameIndex, stringIndex, value) => {
                  const nextTab = props.inSection
                    ? sectionOperations.updatePickingFrame(
                        props.tab,
                        props.inSection.index,
                        bar.index,
                        frameIndex,
                        stringIndex,
                        value,
                      )
                    : tabOperations.updatePickingFrame(
                        props.tab,
                        bar.index,
                        frameIndex,
                        stringIndex,
                        value,
                      );

                  props.updateTab(nextTab);
                }}
              />
            ) : bar.type === BarType.reference ? (
              <ReferenceBarComponent
                {...nonSectionProps}
                bar={bar}
                referencedBar={
                  props.bars.find((b) => b.index === bar.barIndex) as ChordBar | PickingBar
                }
                strummingPatterns={props.tab.strummingPatterns}
              />
            ) : bar.type === BarType.section && section ? (
              <React.Fragment key={bar.index}>
                {section.bars.length
                  ? section.bars.map((nonSectionBar) => {
                      return (
                        <SectionBarComponent
                          {...baseProps}
                          addBar={(type: BarType.chord | BarType.picking | BarType.section) => {
                            addBar(bar.index, type);
                          }}
                          changeSection={(sectionIndex) => {
                            const nextTab = tabOperations.changeSection(
                              props.tab,
                              bar.index,
                              sectionIndex,
                            );
                            props.updateTab(nextTab);
                          }}
                          bar={bar}
                          isFirst={nonSectionBar.index === 0}
                          key={nonSectionBar.index}
                          referencedBar={nonSectionBar}
                          removeBar={() => {
                            const nextTab = tabOperations.removeBar(props.tab, bar.index);
                            props.updateTab(nextTab);
                          }}
                          section={section}
                          sections={props.tab.sections}
                          strummingPatterns={props.tab.strummingPatterns}
                        />
                      );
                    })
                  : props.isEditMode && (
                      <SectionBarComponent
                        {...baseProps}
                        addBar={(type: BarType.chord | BarType.picking | BarType.section) => {
                          addBar(bar.index, type);
                        }}
                        changeSection={(sectionIndex) => {
                          const nextTab = tabOperations.changeSection(
                            props.tab,
                            bar.index,
                            sectionIndex,
                          );
                          props.updateTab(nextTab);
                        }}
                        bar={bar}
                        isFirst={true}
                        removeBar={() => {
                          const nextTab = tabOperations.removeBar(props.tab, bar.index);
                          props.updateTab(nextTab);
                        }}
                        section={section}
                        sections={props.tab.sections}
                        strummingPatterns={props.tab.strummingPatterns}
                      />
                    )}
              </React.Fragment>
            ) : undefined}
          </React.Fragment>
        );
      })}

      {props.isEditMode && (
        <AddBar
          addBar={(type) => {
            addBar(props.bars.length, type);
          }}
          allowInsertSection={props.inSection === undefined}
          expanded={true}
          style={{
            boxSizing: 'border-box',
            flexBasis: `${barWidth}%`,
            height: stringHeight * 6,
            padding: '0 8px',
          }}
        />
      )}
    </div>
  );
};

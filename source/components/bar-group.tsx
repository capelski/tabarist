import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { BarType, repeatsHeight } from '../constants';
import { tabOperations } from '../operations';
import { Bar, ChordBar, PickingBar, Section, Tab } from '../types';
import { AddBar } from './add-bar';
import { addBar } from './bar-commons';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';
import { ReferenceBarComponent } from './reference-bar';
import { SectionBarComponent } from './section-bar';

export type BarGroupProps = {
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

  return (
    <div
      className="bars"
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '100%' }}
    >
      {props.bars.map((bar) => {
        const section = props.tab.sections.find(
          (section) => bar.type === BarType.section && bar.sectionIndex === section.index,
        );

        return (
          <React.Fragment key={bar.index}>
            {bar.type === BarType.chord ? (
              <ChordBarComponent
                bar={bar}
                isEditMode={props.isEditMode}
                inSection={props.inSection}
                tab={props.tab}
                updateTab={props.updateTab}
                width={barWidth}
              />
            ) : bar.type === BarType.picking ? (
              <PickingBarComponent
                bar={bar}
                isEditMode={props.isEditMode}
                inSection={props.inSection}
                tab={props.tab}
                updateTab={props.updateTab}
                width={barWidth}
              />
            ) : bar.type === BarType.reference ? (
              <ReferenceBarComponent
                bar={bar}
                isEditMode={props.isEditMode}
                inSection={props.inSection}
                referencedBar={
                  props.bars.find((b) => b.index === bar.barIndex) as ChordBar | PickingBar
                }
                tab={props.tab}
                updateTab={props.updateTab}
                width={barWidth}
              />
            ) : bar.type === BarType.section && section ? (
              <React.Fragment key={bar.index}>
                {section.bars.length
                  ? section.bars.map((nonSectionBar) => {
                      return (
                        <SectionBarComponent
                          addBar={(type) => {
                            addBar(props.tab, props.updateTab, bar.index, type);
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
                          isEditMode={props.isEditMode}
                          isFirst={nonSectionBar.index === 0}
                          isLast={nonSectionBar.index === section.bars.length - 1}
                          key={nonSectionBar.index}
                          referencedBar={nonSectionBar}
                          removeBar={() => {
                            const nextTab = tabOperations.removeBar(props.tab, bar.index);
                            props.updateTab(nextTab);
                          }}
                          section={section}
                          sections={props.tab.sections}
                          strummingPatterns={props.tab.strummingPatterns}
                          tab={props.tab}
                          updateTab={props.updateTab}
                          width={barWidth}
                        />
                      );
                    })
                  : props.isEditMode && (
                      <SectionBarComponent
                        addBar={(type) => {
                          addBar(props.tab, props.updateTab, bar.index, type);
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
                        isEditMode={props.isEditMode}
                        isFirst={true}
                        isLast={true}
                        removeBar={() => {
                          const nextTab = tabOperations.removeBar(props.tab, bar.index);
                          props.updateTab(nextTab);
                        }}
                        section={section}
                        sections={props.tab.sections}
                        strummingPatterns={props.tab.strummingPatterns}
                        tab={props.tab}
                        updateTab={props.updateTab}
                        width={barWidth}
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
            addBar(props.tab, props.updateTab, props.bars.length, type, props.inSection);
          }}
          allowInsertSection={props.inSection === undefined}
          expanded={true}
          style={{
            boxSizing: 'border-box',
            flexBasis: `${barWidth}%`,
            marginTop: props.inSection ? undefined : repeatsHeight,
            padding: '0 8px',
          }}
        />
      )}
    </div>
  );
};

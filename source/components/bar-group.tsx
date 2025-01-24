import React from 'react';
import { BarType, repeatsHeight } from '../constants';
import { Bar, ChordBar, PickingBar, Section, Tab } from '../types';
import { AddBar } from './add-bar';
import { addBar, copyBarEnd, moveBarEnd } from './bar-commons';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';
import { ReferenceBarComponent } from './reference-bar';
import { SectionBarComponent } from './section-bar';

export type BarGroupProps = {
  bars: Bar[];
  barWidth: string;
  isEditMode: boolean;
  inSection?: Section;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarGroup: React.FC<BarGroupProps> = (props) => {
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
                width={props.barWidth}
              />
            ) : bar.type === BarType.picking ? (
              <PickingBarComponent
                bar={bar}
                isEditMode={props.isEditMode}
                inSection={props.inSection}
                tab={props.tab}
                updateTab={props.updateTab}
                width={props.barWidth}
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
                width={props.barWidth}
              />
            ) : bar.type === BarType.section && section ? (
              <SectionBarComponent
                bar={bar}
                isEditMode={props.isEditMode}
                section={section}
                tab={props.tab}
                updateTab={props.updateTab}
                width={props.barWidth}
              />
            ) : undefined}
          </React.Fragment>
        );
      })}

      {props.isEditMode && (
        <AddBar
          addBar={(type) => {
            addBar(props.tab, props.updateTab, props.bars.length, type, props.inSection);
          }}
          barIndex={props.bars.length}
          copyBarEnd={() => {
            copyBarEnd(props.tab, props.updateTab, props.bars.length, props.inSection);
          }}
          copying={props.tab.copying}
          expanded={true}
          inSection={props.inSection}
          moveBarEnd={() => {
            moveBarEnd(props.tab, props.updateTab, props.bars.length, props.inSection);
          }}
          moving={props.tab.moving}
          style={{
            boxSizing: 'border-box',
            marginTop: props.inSection ? undefined : repeatsHeight,
            padding: '0 8px',
            width: props.barWidth,
          }}
        />
      )}
    </div>
  );
};

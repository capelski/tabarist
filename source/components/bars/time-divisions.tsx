import React from 'react';
import { BarType, ContainerType, slotsDefault, TimeDivisions } from '../../constants';
import { slotOperations, tabOperations } from '../../operations';
import { BarContainer, Rhythm, Tab } from '../../types';
import { SlotDivider } from '../common/slot-divider';
import { RhythmList } from '../rhythms/rhythm-list';
import { ChordBarComponent } from './chord-bar';
import { PickingBarComponent } from './picking-bar';

export type TimeDivisionsComponentProps = {
  container: BarContainer<ContainerType.chord | ContainerType.picking>;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const TimeDivisionsComponent: React.FC<TimeDivisionsComponentProps> = (props) => {
  const mode =
    props.container.renderedBar.rhythmIndex !== undefined
      ? TimeDivisions.tabRhythm
      : TimeDivisions.custom;

  const virtualSlot =
    props.container.renderedBar.rhythmIndex === undefined &&
    slotOperations.createBlockSlot(
      0,
      props.container.renderedBar.type === BarType.chord
        ? props.container.renderedBar.rhythmSlots
        : props.container.renderedBar.chordSupport,
    );

  const setRhythm = (rhythm?: Rhythm) => {
    const nextTab = tabOperations.setBarRhythm(
      props.tab,
      props.container.barIndex,
      rhythm,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  const setSlotSize = (size: number, indexesPath: number[], rhythmIndex?: number) => {
    const nextTab = tabOperations.setBarSlotsSize(
      props.tab,
      props.container.barIndex,
      size,
      indexesPath,
      rhythmIndex,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  return (
    <div
      className="time-divisions"
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid black',
          marginBottom: 8,
          paddingBottom: 8,
          textAlign: 'center',
          width: '100%',
        }}
      >
        {Object.values(TimeDivisions).map((division) => {
          return (
            <div className="form-check form-check-inline" key={division}>
              <input
                className="form-check-input"
                defaultChecked={mode === division}
                id={division}
                name="time-divisions-mode"
                onChange={(event) => {
                  const nextMode = event.target.value as TimeDivisions;
                  if (nextMode === TimeDivisions.custom) {
                    setSlotSize(slotsDefault, [], props.container.renderedBar.rhythmIndex);
                  } else if (nextMode === TimeDivisions.tabRhythm) {
                    setRhythm();
                  }
                }}
                type="radio"
                value={division}
              />
              <label className="form-check-label" htmlFor={division}>
                {division}
              </label>
            </div>
          );
        })}
      </div>

      <div style={{ flexGrow: 1 }}>
        {virtualSlot && (
          <SlotDivider
            denominator={undefined}
            indexesPath={[]}
            isFirstSlot={true}
            parentSlotSize={virtualSlot.slots.length}
            setSlotSize={setSlotSize}
            slot={virtualSlot}
          />
        )}

        {props.container.renderedBar.rhythmIndex !== undefined && (
          <RhythmList
            container={props.container}
            selectedRhythmIndex={props.container.renderedBar.rhythmIndex}
            tab={props.tab}
            updateTab={props.updateTab}
          />
        )}

        <div style={{ marginTop: 16 }}>
          {props.container.type === ContainerType.chord && (
            <ChordBarComponent
              {...props}
              activeSlot={undefined}
              container={props.container as BarContainer<ContainerType.chord>}
              areRhythmSlotsEditable={true}
              isEditMode={true}
            />
          )}

          {props.container.type === ContainerType.picking && (
            <PickingBarComponent
              {...props}
              activeSlot={undefined}
              container={props.container as BarContainer<ContainerType.picking>}
              isEditMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

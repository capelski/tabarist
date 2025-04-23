import React from 'react';
import { ContainerType } from '../../constants';
import { tabOperations } from '../../operations';
import { BarContainer, Rhythm, Slot } from '../../types';
import { SlotsValue } from '../common/slots-value';
import { BarComponentBaseProps, getSlotBackgroundColor } from './bar-handlers';
import { RhythmPicker, RhythmPickerProps } from './rhythm-picker';

export type ChordBarCoreProps = BarComponentBaseProps & {
  container: BarContainer<ContainerType.chord>;
  rhythms: Rhythm[];
};

export const ChordBarComponent: React.FC<ChordBarCoreProps> = (props) => {
  const rhythm = props.rhythms.find(
    (rhythm) => rhythm.index === props.container.renderedBar.rhythmIndex,
  )!;
  const canUpdate = props.isEditMode && props.container.canUpdate;

  const getBackgroundColor = (slot: Slot) => {
    return (
      getSlotBackgroundColor(props.activeSlot, props.container.position, slot.index) ??
      props.container.backgroundColor
    );
  };

  const setRhythm: RhythmPickerProps['setRhythm'] = (rhythm) => {
    const nextTab = tabOperations.setChordBarRhythm(
      props.tab,
      props.container.barIndex,
      rhythm,
      props.container.parentSection,
    );
    props.updateTab(nextTab);
  };

  const setSlotValue = (value: string, indexesPath: number[]) => {
    const nextTab = tabOperations.setChordBarSlotValue(
      props.tab,
      props.container.barIndex,
      value,
      indexesPath,
      props.container.parentSection,
    );

    props.updateTab(nextTab);
  };

  return (
    <div
      className="chord-bar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
      {canUpdate && (
        <div
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}
        >
          <RhythmPicker
            setRhythm={setRhythm}
            rhythmIndex={props.container.renderedBar.rhythmIndex}
            rhythms={props.tab.rhythms}
          />
        </div>
      )}

      <SlotsValue
        backgroundColor={getBackgroundColor}
        canUpdate={canUpdate}
        elementType="input"
        indexesPath={[]}
        setSlotValue={setSlotValue}
        slots={props.container.renderedBar.slots}
      />

      <SlotsValue
        backgroundColor={getBackgroundColor}
        canUpdate={false}
        color={props.container.omitRhythm ? '#bbb' : undefined}
        elementType="input"
        indexesPath={[]}
        setSlotValue={() => {}}
        slots={rhythm.slots}
      />
    </div>
  );
};

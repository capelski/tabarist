import React from 'react';
import { Bar } from '../types';
import { AddBar, AddBarProps } from './add-bar';
import { BarControls, BarControlsHandlers } from './bar-controls';

export type BaseBarProps = BarControlsHandlers & {
  addBar: AddBarProps['addBar'];
  additionalControls?: React.ReactNode;
  allowInsertSection?: boolean;
  bar: Bar;
  canAddBar: boolean;
  coreComponent: React.ReactNode;
  displayBarControls: boolean;
  width: number;
};

export const BaseBarComponent: React.FC<BaseBarProps> = (props) => {
  return (
    <div
      className="bar"
      style={{ display: 'flex', flexDirection: 'column', width: `${props.width}%` }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        {props.canAddBar && (
          <AddBar
            addBar={props.addBar}
            allowInsertSection={props.allowInsertSection}
            style={{ minHeight: 60 }}
          />
        )}

        {props.coreComponent}
      </div>

      {props.displayBarControls && (
        <BarControls currentBar={props.bar} copyBar={props.copyBar} removeBar={props.removeBar}>
          {props.additionalControls}
        </BarControls>
      )}
    </div>
  );
};

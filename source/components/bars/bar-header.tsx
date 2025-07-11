import React from 'react';
import { inputWidth, repeatsMinHeight, sectionControlsWidth } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, PositionOperation, Tab } from '../../types';
import { BarControls } from './bar-controls';

export type BarHeaderProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  isEditMode: boolean | undefined;
  positionOperation: PositionOperation | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarHeader: React.FC<BarHeaderProps> = (props) => {
  const { repeatsValue } = props.container;
  const hasRepeats = repeatsValue && repeatsValue > 1;
  const remainingRepeats =
    props.activeSlot?.barContainer.firstSectionBarPosition ===
      props.container.firstSectionBarPosition && props.activeSlot?.repeats;

  const updateRepeats = (nextRepeats: number) => {
    if (props.container.repeatsBarIndex === undefined) {
      return;
    }

    const nextTab = tabOperations.updateRepeats(
      props.tab,
      props.container.repeatsBarIndex,
      isNaN(nextRepeats) ? undefined : nextRepeats,
    );
    props.updateTab(nextTab);
  };

  const updateSectionName = (sectionName: string) => {
    if (props.container.sectionNameBarIndex === undefined) {
      return;
    }

    const nextTab = tabOperations.renameSection(
      props.tab,
      props.container.sectionNameBarIndex,
      sectionName,
    );
    props.updateTab(nextTab);
  };

  return (
    <div
      className="bar-header"
      style={{
        backgroundColor: props.container.backgroundColor,
        borderBottom: props.isEditMode ? '1px solid black' : undefined,
        marginBottom: 4,
        marginRight: props.container.isLastInSectionBar ? 8 : undefined,
        paddingBottom: props.isEditMode ? 4 : undefined,
        paddingLeft: props.isEditMode ? undefined : 8,
        paddingTop: props.isEditMode ? 4 : undefined,
      }}
    >
      {props.isEditMode ? (
        <div style={{ alignItems: 'center', display: 'flex', height: repeatsMinHeight }}>
          {props.container.displayRepeats && (
            <div>
              <input
                onChange={(event) => {
                  const nextRepeats = parseInt(event.target.value);
                  updateRepeats(nextRepeats);
                }}
                style={{
                  boxSizing: 'border-box',
                  maxHeight: repeatsMinHeight,
                  maxWidth: inputWidth,
                }}
                value={repeatsValue ?? ''}
              />
              x
            </div>
          )}
          {props.container.sectionName !== undefined && (
            <input
              disabled={!props.container.canUpdate}
              onChange={(event) => {
                updateSectionName(event.target.value);
              }}
              style={{
                flexGrow: 1,
                marginLeft: 4,
                marginRight: 4,
                maxHeight: 20,
                width: `calc(100% - ${sectionControlsWidth}px)`,
              }}
              value={props.container.sectionName}
            />
          )}
          {props.container.displayControls && (
            <BarControls
              {...props}
              style={props.container.sectionName ? undefined : { flexGrow: 1 }}
            />
          )}
        </div>
      ) : (
        <div style={{ height: repeatsMinHeight }}>
          {props.container.displayRepeats && (
            <span
              style={{
                display: 'inline-block',
                lineHeight: `${repeatsMinHeight}px`,
                maxHeight: repeatsMinHeight,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {remainingRepeats ? (
                <span style={{ fontWeight: 'bold' }}>{remainingRepeats}x </span>
              ) : (
                hasRepeats && <span>{repeatsValue}x </span>
              )}
              {props.container.parentSection?.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

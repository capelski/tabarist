import React from 'react';
import { inputWidth, repeatsMinHeight, sectionNameMaxWidth } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, BarContainer, Tab } from '../../types';
import { BarControls } from './bar-controls';

export type BarHeaderProps = {
  activeSlot: ActiveSlot | undefined;
  container: BarContainer;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const BarHeader: React.FC<BarHeaderProps> = (props) => {
  const { repeats } = props.container;
  const hasRepeats = repeats && repeats > 1;
  const remainingRepeats =
    props.activeSlot?.barContainer.firstSectionBarPosition ===
      props.container.firstSectionBarPosition && props.activeSlot?.repeats;

  const updateRepeats = (nextRepeats?: number) => {
    const nextTab = tabOperations.updateRepeats(
      props.tab,
      props.container.barIndex,
      nextRepeats,
      props.container.parentSection,
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
          {!props.container.parentSection && (
            <div>
              <input
                onChange={(event) => {
                  const nextRepeats = parseInt(event.target.value);
                  updateRepeats(isNaN(nextRepeats) ? undefined : nextRepeats);
                }}
                style={{
                  boxSizing: 'border-box',
                  marginRight: 4,
                  maxHeight: repeatsMinHeight,
                  maxWidth: inputWidth,
                }}
                value={repeats ?? ''}
              />
              x
            </div>
          )}
          {props.container.displayControls && (
            <BarControls container={props.container} tab={props.tab} updateTab={props.updateTab} />
          )}
        </div>
      ) : (
        <div style={{ height: repeatsMinHeight }}>
          {(!props.container.parentSection || props.container.isFirstInSectionBar) && (
            <span
              style={{
                display: 'inline-block',
                lineHeight: `${repeatsMinHeight}px`,
                maxHeight: repeatsMinHeight,
                maxWidth: sectionNameMaxWidth,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {remainingRepeats ? (
                <span style={{ fontWeight: 'bold' }}>{remainingRepeats}x </span>
              ) : (
                hasRepeats && <span>{repeats}x </span>
              )}
              {props.container.parentSection?.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

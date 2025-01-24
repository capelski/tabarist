import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { BarGroup, SectionComponent, StrummingPatternComponent } from '../components';
import { Modal } from '../components/modal';
import {
  addSymbol,
  editSymbol,
  queryParameters,
  removeSymbol,
  RouteNames,
  saveSymbol,
  ViewMode,
} from '../constants';
import { User } from '../firebase';
import { sPatternOperations, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type TabViewProps = {
  user: User | null;
};

export const TabView: React.FC<TabViewProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [tab, setTab] = useState<Tab>();
  const [viewMode, setViewMode] = useState(ViewMode.adaptive);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const { tabId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tabId) {
      tabRepository.getById(tabId).then(setTab);
    }
  }, [tabId]);

  useEffect(() => {
    if (searchParams.get(queryParameters.editMode) === 'true') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [searchParams]);

  if (!tab) {
    return <h3>Couldn't load tab</h3>;
  }

  const { areModesEquivalent, barWidth } = tabOperations.getLongestBarWidth(
    tab,
    windowWidth,
    viewMode,
  );
  const isTabOwner = props.user && props.user.uid === tab.ownerId;

  const addSection = () => {
    setTab(tabOperations.addSection(tab));
  };

  const addStrummingPattern = () => {
    setTab(tabOperations.addStrummingPattern(tab));
  };

  const cancelDelete = () => {
    setDeletingTab('');
  };

  const confirmDelete = async () => {
    if (!isTabOwner) {
      return;
    }

    await tabRepository.remove(deletingTab);
    cancelDelete();
    navigate(RouteNames.myTabs);
  };

  const removeTab = () => {
    setDeletingTab(tab.id);
  };

  const toggleEditMode = async () => {
    if (!isTabOwner) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);

    if (isEditMode) {
      await tabRepository.set(tab, props.user!.uid);

      nextSearchParams.delete(queryParameters.editMode);
    } else {
      nextSearchParams.set(queryParameters.editMode, 'true');
    }

    setIsEditMode(!isEditMode);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tab">
      {deletingTab && (
        <Modal closeHandler={cancelDelete}>
          <p>Are you sure you want to delete this tab?</p>
          <div>
            <button onClick={confirmDelete} style={{ marginRight: 8 }} type="button">
              Delete
            </button>
            <button onClick={cancelDelete} type="button">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h3>
          {isEditMode ? (
            <input
              value={tab.title}
              onChange={(event) => {
                setTab(tabOperations.updateTitle(tab, event.target.value));
              }}
            />
          ) : (
            tab.title
          )}
        </h3>
        {isTabOwner && (
          <React.Fragment>
            <button onClick={toggleEditMode} style={{ marginLeft: 8 }} type="button">
              {isEditMode ? saveSymbol : editSymbol}
            </button>
            <button onClick={removeTab} style={{ marginLeft: 8 }} type="button">
              {removeSymbol}
            </button>
          </React.Fragment>
        )}
        {!areModesEquivalent && (
          <React.Fragment>
            <span style={{ marginLeft: 8 }}>👁️</span>
            <select
              onChange={(event) => {
                const nextViewMode = event.target.value as ViewMode;
                setViewMode(nextViewMode);
              }}
              style={{ marginLeft: 8 }}
              value={viewMode}
            >
              {Object.values(ViewMode).map((viewMode) => {
                return (
                  <option key={viewMode} value={viewMode}>
                    {viewMode}
                  </option>
                );
              })}
            </select>
          </React.Fragment>
        )}
      </div>

      <BarGroup
        bars={tab.bars}
        barWidth={`${barWidth}px`}
        isEditMode={isEditMode}
        tab={tab}
        updateTab={setTab}
      />

      {isEditMode && (
        <React.Fragment>
          <h3>Strumming patterns</h3>
          <p>
            <button onClick={addStrummingPattern} type="button">
              {addSymbol} strumming pattern
            </button>
          </p>

          {tab.strummingPatterns.map((sPattern) => {
            return (
              <StrummingPatternComponent
                key={sPattern.index}
                rebase={(framesNumber) => {
                  setTab(sPatternOperations.rebase(tab, sPattern.index, framesNumber));
                }}
                strummingPattern={sPattern}
                tab={tab}
                update={(frameIndex, value) => {
                  setTab(sPatternOperations.update(tab, sPattern.index, frameIndex, value));
                }}
                updateTab={setTab}
              />
            );
          })}

          <h3>Sections</h3>
          <p>
            <button onClick={addSection} type="button">
              {addSymbol} section
            </button>
          </p>

          {tab.sections.map((section) => {
            return (
              <SectionComponent
                barWidth={`${barWidth}px`}
                isEditMode={isEditMode}
                key={section.index}
                section={section}
                tab={tab}
                updateTab={setTab}
              />
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};

import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { RouteNames } from '../../constants';
import { tabRepository } from '../../repositories';
import { ActionType, loadAllTabs, loadMyTabs, StateProvider } from '../../state';
import { Tab } from '../../types';
import { Modal } from '../common/modal';

export type TabDeletionModalProps = {
  tab: Tab;
};

export const TabDeletionModal: React.FC<TabDeletionModalProps> = (props) => {
  const { dispatch, state } = useContext(StateProvider);
  const { state: locationState } = useLocation();
  const navigate = useNavigate();

  const cancelDelete = () => {
    dispatch({ type: ActionType.deleteCancel });
  };

  const confirmDelete = async () => {
    dispatch({ type: ActionType.loaderDisplay });
    await tabRepository.remove(props.tab!.id);
    dispatch({ type: ActionType.deleteCompleted });

    if (state.deleteTabModal!.route === RouteNames.allTabs) {
      loadAllTabs(state[RouteNames.allTabs].params, dispatch);
    } else if (state.deleteTabModal!.route === RouteNames.myTabs) {
      loadMyTabs(state.user.document!.uid, state[RouteNames.myTabs].params, dispatch);
    } else if (state.deleteTabModal!.route === RouteNames.tabDetails) {
      if (locationState?.navigateBack) {
        navigate(-1);
      } else {
        navigate(RouteNames.allTabs);
      }
    }
  };

  return (
    props.tab && (
      <Modal closeHandler={cancelDelete} hideCloseButton={true}>
        <p>
          Are you sure you want to delete <b>{props.tab.title}</b>?
        </p>
        <div>
          <button
            className="btn btn-danger"
            onClick={confirmDelete}
            style={{ marginRight: 8 }}
            type="button"
          >
            Delete
          </button>
          <button className="btn btn-outline-secondary" onClick={cancelDelete} type="button">
            Cancel
          </button>
        </div>
      </Modal>
    )
  );
};

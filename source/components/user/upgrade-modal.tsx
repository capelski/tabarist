import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { customerRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { Modal } from '../common/modal';

export type UpgradeModalProps = {
  user: User | null;
};

export const UpgradeModal: React.FC<UpgradeModalProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  const cancelUpgrade = () => {
    dispatch({ type: ActionType.upgradeCancel });
  };

  const upgrade = async () => {
    if (!props.user) {
      return;
    }

    dispatch({ type: ActionType.upgradeCancel });
    dispatch({ type: ActionType.loaderDisplay });

    try {
      const checkoutUrl = await customerRepository.createCheckoutSession(props.user.uid);
      window.location.assign(checkoutUrl);
    } catch (error) {
      dispatch({ type: ActionType.loaderHide });

      console.error(error);
      toast('An error occurred while connecting to Stripe', {
        type: 'error',
        autoClose: 5000,
      });
    }
  };

  return (
    <Modal closeHandler={cancelUpgrade}>
      <p>Support Tabarist with a monthly subscription</p>
      <button
        className="btn btn-primary"
        onClick={upgrade}
        style={{ marginRight: 8 }}
        type="button"
      >
        Upgrade
      </button>
    </Modal>
  );
};

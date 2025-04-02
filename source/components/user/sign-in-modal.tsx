import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { PropsWithChildren, useContext } from 'react';
import { toast } from 'react-toastify';
import { ActionType } from '../../action-type';
import { DispatchProvider } from '../../dispatch-provider';
import { getFirebaseContext } from '../../firebase-context';
import { Modal } from '../common/modal';

export type SignInModalProps = PropsWithChildren<{}>;

export const SignInModal: React.FC<SignInModalProps> = (props) => {
  const dispatch = useContext(DispatchProvider);

  const finishSignIn = () => {
    dispatch({ type: ActionType.signInFinish });
  };

  const signIn = async () => {
    try {
      await signInWithPopup(getFirebaseContext().auth, new GoogleAuthProvider());
      finishSignIn();
    } catch (error) {
      console.log(error);
      toast('The sign in was not completed', { type: 'error', autoClose: 5000 });
    }
  };

  return (
    <Modal closeHandler={finishSignIn}>
      {props.children}
      <button onClick={signIn} style={{ marginRight: 8 }} type="button">
        Sign in with google
      </button>
    </Modal>
  );
};

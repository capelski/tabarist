import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { PropsWithChildren } from 'react';
import { toast } from 'react-toastify';
import { getFirebaseContext } from '../../firebase-context';
import { Modal } from '../common/modal';

export type SignInModalProps = PropsWithChildren<{
  cancelSignIn: () => void;
}>;

export const SignInModal: React.FC<SignInModalProps> = (props) => {
  const signIn = async () => {
    try {
      await signInWithPopup(getFirebaseContext().auth, new GoogleAuthProvider());
      props.cancelSignIn();
    } catch (error) {
      console.log(error);
      toast('The sign in was not completed', { type: 'error', autoClose: 5000 });
    }
  };

  return (
    <Modal closeHandler={props.cancelSignIn}>
      {props.children}
      <button onClick={signIn} style={{ marginRight: 8 }} type="button">
        Sign in with google
      </button>
    </Modal>
  );
};

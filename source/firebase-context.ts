import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-config.json';

export const getFirebaseContext = (function () {
  let firebaseContext:
    | {
        app: FirebaseApp;
        auth: Auth;
        firestore: Firestore;
      }
    | undefined = undefined;

  return function () {
    if (!firebaseContext) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      firebaseContext = {
        app,
        auth,
        firestore,
      };
    }

    return firebaseContext;
  };
})();

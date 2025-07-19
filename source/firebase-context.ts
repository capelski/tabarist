import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';
import firebaseConfig from '../firebase-config.json';

export const functionsRegion = 'europe-west3';

export const getFirebaseContext = (function () {
  let firebaseContext:
    | {
        app: FirebaseApp;
        auth: Auth;
        firestore: Firestore;
        functions: Functions;
      }
    | undefined = undefined;

  return function () {
    if (!firebaseContext) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = initializeFirestore(app, { localCache: persistentLocalCache() });
      const functions = getFunctions(app, functionsRegion);

      firebaseContext = {
        app,
        auth,
        firestore,
        functions,
      };
    }

    return firebaseContext;
  };
})();

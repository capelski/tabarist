import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

export { User } from 'firebase/auth';

// The firebase initialization is lazy loaded so it can be skipped in GitHub pages

let firebaseApp: FirebaseApp;
export const getFirebaseApp = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(WEBPACK_FIREBASE_CONFIG);
  }

  return firebaseApp;
};

let firebaseAuth: Auth;
export const getFirebaseAuth = () => {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }

  return firebaseAuth;
};

let firebaseDb: Firestore;
export const getFirebaseDb = () => {
  if (!firebaseDb) {
    firebaseDb = initializeFirestore(getFirebaseApp(), {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  }

  return firebaseDb;
};

export const signInWithGoogle = () => {
  return signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
};

export const signOut = () => {
  return getFirebaseAuth().signOut();
};

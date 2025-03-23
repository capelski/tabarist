import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseContext } from './firebase-context';

export const deleteDocument = (path: string[]) => {
  const [collection, ...rest] = path;
  return deleteDoc(doc(getFirebaseContext().firestore, collection, ...rest));
};

export const getDocument = async (path: string[]) => {
  const [collectionName, ...rest] = path;
  const docRef = doc(getFirebaseContext().firestore, collectionName, ...rest);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : undefined;
};

const removeUndefinedProperties = (target: any): any => {
  return !target || typeof target !== 'object'
    ? target
    : Array.isArray(target)
    ? target.map((item) => removeUndefinedProperties(item))
    : Object.entries(target).reduce((reduced, [property, value]) => {
        return value === undefined
          ? reduced
          : { ...reduced, [property]: removeUndefinedProperties(value) };
      }, {});
};

export const setDocument = (path: string[], document: any) => {
  const [collection, ...rest] = path;
  return setDoc(
    doc(getFirebaseContext().firestore, collection, ...rest),
    removeUndefinedProperties(document),
  );
};

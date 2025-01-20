import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

export const deleteDocument = (path: string[]) => {
  const [collection, ...rest] = path;
  return deleteDoc(doc(getFirebaseDb(), collection, ...rest));
};

export const getCollectionDocuments = async (path: string[]) => {
  const [collectionName, ...rest] = path;

  const queryData = query(collection(getFirebaseDb(), collectionName, ...rest));
  const querySnapshot = await getDocs(queryData);
  return querySnapshot.docs.map((snapshot) => snapshot.data());
};

export const getDocument = async (path: string[]) => {
  const [collectionName, ...rest] = path;
  const docRef = doc(getFirebaseDb(), collectionName, ...rest);
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
  return setDoc(doc(getFirebaseDb(), collection, ...rest), removeUndefinedProperties(document));
};

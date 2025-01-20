import { tabFirestoreRepository } from './tab.firestore-repository';
import { tabLocalRepository } from './tab.local-repository';

export const tabRepository = WEBPACK_USE_FIREBASE ? tabFirestoreRepository : tabLocalRepository;

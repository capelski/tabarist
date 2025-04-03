import { User } from 'firebase/auth';
import { addDoc, collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseContext } from '../firebase-context';
import { StripeSubscription } from '../types';

const checkoutSessionsCollection = 'checkout_sessions';
const customersCollection = 'customers';
const subscriptionsCollection = 'subscriptions';

const stripePortalLinkFunction = 'ext-firestore-stripe-payments-createPortalLink';
const stripePriceId = 'price_1R5uC0I1pnoPtl4c4Z6s5Ryd';

export const customerRepository = {
  createCheckoutSession: async (userId: User['uid']): Promise<string> => {
    const checkoutSessionRef = await addDoc(
      collection(
        getFirebaseContext().firestore,
        customersCollection,
        userId,
        checkoutSessionsCollection,
      ),
      {
        cancel_url: window.location.origin,
        price: stripePriceId,
        success_url: window.location.origin,
      },
    );

    return new Promise<string>((resolve, reject) => {
      const unsubscribe = onSnapshot(checkoutSessionRef, (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : undefined;
        if (!data) {
          return;
        }

        if (data.error) {
          unsubscribe();
          reject(data.error);
        } else if (data.url) {
          unsubscribe();
          resolve(data.url);
        }
      });
    });
  },
  getPortalLink: async () => {
    const functionRef = httpsCallable(getFirebaseContext().functions, stripePortalLinkFunction);
    const { data } = await functionRef({ returnUrl: window.location.origin });
    return (data as { url: string }).url;
  },
  getSubscription: async (userId: User['uid']) => {
    const queryData = query(
      collection(
        getFirebaseContext().firestore,
        customersCollection,
        userId,
        subscriptionsCollection,
      ),
      limit(1),
    );
    const querySnapshot = await getDocs(queryData);
    const subscription = querySnapshot.docs[0]?.exists() ? querySnapshot.docs[0].data() : undefined;
    return subscription as StripeSubscription;
  },
};

import { arrayUnion, doc, Firestore, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { tokens, Token, PaymentLink } from 'config';

function mergeTokensWithConfig(userTokens: Token[], defaultTokens: Token[]): Token[] {
  return defaultTokens.map((defaultToken) => {
    const userToken = userTokens.find(
      (t) => t.address === defaultToken.address && t.network?.name === defaultToken.network?.name
    );

    return userToken ? { ...defaultToken, ...userToken } : defaultToken;
  });
}

export const fetchUserSettings = async (
  db: Firestore,
  userId: string
): Promise<{
  tokens: Token[];
}> => {
  try {
    const userSettingsRef = doc(db, 'userSettings', userId || '');
    const userSettingsSnapshot = await getDoc(userSettingsRef);

    if (userSettingsSnapshot.exists()) {
      const data = userSettingsSnapshot.data();
      const mergedTokens = mergeTokensWithConfig(data.tokens || [], tokens);

      await saveUserSettings(db, userId, mergedTokens);

      return {
        tokens: mergedTokens
      };
    } else {
      await setDoc(userSettingsRef, { tokens });
      return { tokens };
    }
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

export const saveUserSettings = async (db: Firestore, userId: string, tokens: Token[]) => {
  try {
    const userSettingsRef = doc(db, 'userSettings', userId || '');

    await setDoc(userSettingsRef, { tokens }, { merge: true });
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

export const savePaymentLink = async (db: Firestore, userId: string, paymentLink: PaymentLink) => {
  try {
    const paymentLinkRef = doc(db, 'paymentLinks', userId || '');
    const docSnap = await getDoc(paymentLinkRef);

    if (docSnap.exists()) {
      await updateDoc(paymentLinkRef, {
        payments: arrayUnion(paymentLink)
      });
    } else {
      await setDoc(paymentLinkRef, {
        payments: [paymentLink]
      });
    }
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

export const getAllPaymentsByUserId = async (db: Firestore, userId: string) => {
  if (!userId) {
    console.error('User ID is required');
    return null;
  }

  const userDocRef = doc(db, 'paymentLinks', userId);

  try {
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const { payments } = docSnap.data();
      return payments || [];
    } else {
      console.log('No payment data found for this user.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching payments: ', error);
    return [];
  }
};

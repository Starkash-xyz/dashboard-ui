import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
import { tokens, Token } from 'config';
import { FirebaseContextType } from 'types/auth';

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
  auth: FirebaseContextType
): Promise<{
  tokens: Token[];
}> => {
  try {
    const user = auth.user;
    if (!user) throw new Error('User not authenticated');

    const userSettingsRef = doc(db, 'userSettings', user.uid || '');
    const userSettingsSnapshot = await getDoc(userSettingsRef);

    if (userSettingsSnapshot.exists()) {
      const data = userSettingsSnapshot.data();
      const mergedTokens = mergeTokensWithConfig(data.tokens || [], tokens);

      await saveUserSettings(db, auth, mergedTokens);

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

export const saveUserSettings = async (db: Firestore, auth: FirebaseContextType, tokens: Token[]) => {
  try {
    const user = auth.user;
    if (!user) throw new Error('User not authenticated');

    const userSettingsRef = doc(db, 'userSettings', user.uid || '');

    await setDoc(userSettingsRef, { tokens }, { merge: true });
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

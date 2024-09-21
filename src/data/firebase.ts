import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
import { tokens, Token } from 'config';

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

import React, { createContext, useEffect, useReducer } from 'react';
import { collection, addDoc, getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// third-party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// action - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import { AuthProps, FirebaseContextType } from 'types/auth';

// firebase initialize
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
  });
}

// const
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const db = getFirestore(firebase.apps[0]);

  async function saveUser(user: any) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName || ''
        });

        console.log('User saved with ID: ', user.uid);
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(async (user: any) => {
        if (user) {
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                email: user.email!,
                name: user.displayName || ''
              }
            }
          });

          await saveUser(user);
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const firebaseEmailPasswordSignIn = (email: string, password: string) => firebase.auth().signInWithEmailAndPassword(email, password);

  const firebaseGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const firebaseTwitterSignIn = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const firebaseFacebookSignIn = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const firebaseRegister = async (email: string, password: string) => firebase.auth().createUserWithEmailAndPassword(email, password);

  const logout = () => firebase.auth().signOut();

  const resetPassword = async (email: string) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const updateProfile = () => {};
  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <FirebaseContext.Provider
      value={{
        ...state,
        firebaseRegister,
        firebaseEmailPasswordSignIn,
        login: () => {},
        firebaseGoogleSignIn,
        firebaseTwitterSignIn,
        firebaseFacebookSignIn,
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;

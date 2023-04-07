import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore, // gives us the instance of firestore db
  doc, //helps us retrieve documents inside of fs db or get a document instance
  getDoc, // helps us to get data from the documents
  setDoc, // helps us to set data to the documents
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyChfKxGbT-hLBU1dvnnwcgQAC4-PzEvFhA',
  authDomain: 'crwn-clothingnew-db.firebaseapp.com',
  projectId: 'crwn-clothingnew-db',
  storageBucket: 'crwn-clothingnew-db.appspot.com',
  messagingSenderId: '383117992164',
  appId: '1:383117992164:web:01b9b230771d42fa8d0cf1',
};

const firebaseApp = initializeApp(firebaseConfig);
// this gives us the instance of google auth provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// this gives us the instance of our authentication
export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};
export const signOutUser = async () => await signOut(auth);
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

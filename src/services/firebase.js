import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBU-CE3vKatQR_pdLPZrVv2AYj-u55Liy8",
  authDomain: "movie-review-website-99d10.firebaseapp.com",
  projectId: "movie-review-website-99d10",
  storageBucket: "movie-review-website-99d10.firebasestorage.app",
  messagingSenderId: "318212049048",
  appId: "1:318212049048:web:f753b8dd7c5abe449ae8ed",
  measurementId: "G-8LJWKZCZZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Comment out analytics if not using
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Register new user
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      favoriteGenres: [],
      watchlist: [],
      reviews: []
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'Registration failed';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Use at least 6 characters.';
        break;
      default:
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'Login failed';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      default:
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Add to watchlist
export const addToWatchlist = async (userId, movie) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      watchlist: arrayUnion(movie)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { auth, db };
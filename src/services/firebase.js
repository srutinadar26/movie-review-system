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
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  getDoc,        // ← ADD THIS MISSING IMPORT
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc
} from 'firebase/firestore';

// Your Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ============= AUTHENTICATION FUNCTIONS =============

// Register new user
export const registerUser = async (email, password, displayName) => {
  try {
    console.log('Starting registration for:', email);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created in Auth:', userCredential.user.uid);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    console.log('Profile updated with display name');
    
    // Create user document in Firestore
    try {
      const userData = {
        uid: userCredential.user.uid,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        favoriteGenres: [],
        watchlist: [],
        reviews: []
      };
      
      // Use setDoc with uid as document ID for easier querying
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('User document created in Firestore');
      
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      // If Firestore fails, we should still return success for auth
      // but log the error
    }
    
    return { success: true, user: userCredential.user };
    
  } catch (error) {
    console.error('Registration error details:', error);
    
    // Handle specific Firebase errors
    let errorMessage = 'Registration failed';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password sign up is not enabled. Please enable it in Firebase Console.';
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
    console.log('Attempting login for:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful for:', userCredential.user.uid);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
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
    console.log('User logged out');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ============= USER DATA FUNCTIONS =============

// Save user preferences
export const saveUserPreferences = async (userId, preferences) => {
  try {
    await setDoc(doc(db, 'users', userId), preferences, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error: error.message };
  }
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
    console.error('Error adding to watchlist:', error);
    return { success: false, error: error.message };
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (userId, movieId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedWatchlist = userData.watchlist.filter(m => m.id !== movieId);
      
      await updateDoc(userRef, {
        watchlist: updatedWatchlist
      });
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
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
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

export { auth, db };
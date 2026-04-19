import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyP2Z4-RLYIcw8mEczIVVeJ3CWuTK1oo0",
  authDomain: "thal-dashboard.firebaseapp.com",
  projectId: "thal-dashboard",
  storageBucket: "thal-dashboard.firebasestorage.app",
  messagingSenderId: "666431135366",
  appId: "1:666431135366:web:1f31ab8cf6ad68ef43fb07",
  measurementId: "G-2JRN7J3Q7T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { db, analytics };

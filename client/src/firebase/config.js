// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ5DrRk1UDimh3Aop-9EseqfFj-KWW7Rk",
  authDomain: "investamon-43293.firebaseapp.com",
  projectId: "investamon-43293",
  storageBucket: "investamon-43293.firebasestorage.app",
  messagingSenderId: "722585500863",
  appId: "1:722585500863:web:d3bd531d613a0f639cda0a",
  measurementId: "G-69VCPYT3CK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, db, auth, analytics };
export default db;

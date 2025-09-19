// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase project configuration

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  // Initialize Firestore database
  db = getFirestore(app);
  // Initialize Cloud Storage
  storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Firebase will be undefined, which we'll check for in other files
  app = null;
  db = null;
  storage = null;
}

export { db, storage, app };
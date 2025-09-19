import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE3Kut8Brw0i3HNbDCBBZJOvzdObFUYVg",
  authDomain: "sutdentattendance-4a285.firebaseapp.com",
  projectId: "sutdentattendance-4a285",
  storageBucket: "sutdentattendance-4a285.firebasestorage.app",
  messagingSenderId: "774622343062",
  appId: "1:774622343062:web:51f2057273ef28f04177b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Cloud Storage
const storage = getStorage(app);

export { db, storage, app };
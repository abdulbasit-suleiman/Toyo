'use client';

import { db, storage } from '../utils/firebase';
import { useEffect } from 'react';

export default function FirebaseProvider({ children }) {
  useEffect(() => {
    // Firebase is already initialized in the firebase.js file
    console.log('Firebase initialized');
  }, []);

  return children;
}
// src/firebaseConfig.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// ✅ Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcrYFx5bDVmm83rGBs7Vj2onFS2E_0skc",
  authDomain: "quickfix-4dcd0.firebaseapp.com",
  projectId: "quickfix-4dcd0",
  storageBucket: "quickfix-4dcd0.appspot.com",
  messagingSenderId: "817704240862",
  appId: "1:817704240862:web:a08ba2cf928364411c644f"
};

// ✅ Initialize Firebase only once
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// ✅ Export reusable auth & db instances
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
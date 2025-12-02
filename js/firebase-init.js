// js/firebase-init.js

// TODO: replace this with your actual config from Firebase console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "1:XXXXXXX:web:XXXXXXXX"
};

// Initialize Firebase (compat style)
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();

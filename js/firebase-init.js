// js/firebase-init.js

console.log("firebase-init.js loaded");

// Your Firebase configuration (from Firebase Console → Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyDK04VsSPPISd7KWFrPQ5r1VE4h3hfiuQA",
  authDomain: "expenditure-tracker-5569c.firebaseapp.com",
  projectId: "expenditure-tracker-5569c",
  storageBucket: "expenditure-tracker-5569c.firebasestorage.app",
  messagingSenderId: "946973275836",
  appId: "1:946973275836:web:d388f6ff00eb76b4cf82b9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make Firestore available
const db = firebase.firestore();

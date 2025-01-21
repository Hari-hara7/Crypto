// src/utils/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6FTYPFv48pIi9Gx53lWmPp4vZWwjKL98",
  authDomain: "academicpal-706ff.firebaseapp.com",
  projectId: "academicpal-706ff",
  storageBucket: "academicpal-706ff.firebasestorage.app",
  messagingSenderId: "890532166738",
  appId: "1:890532166738:web:1df65e4d2b2c6ce0bff38b",
  measurementId: "G-JXN7W3VSXW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut, db };

// firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig";
// https://firebase.google.com/docs/web/setup#available-libraries



// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('hi from firebase config');

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
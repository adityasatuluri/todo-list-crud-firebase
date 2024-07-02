// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkThV8-J3ekwkW_zbidemGjGMmOl_VuMY",
  authDomain: "todo-list-firebase-eeaa2.firebaseapp.com",
  projectId: "todo-list-firebase-eeaa2",
  storageBucket: "todo-list-firebase-eeaa2.appspot.com",
  messagingSenderId: "950536667693",
  appId: "1:950536667693:web:a71b76124f1d172f8a6ea4",
  measurementId: "G-WNYT1ERFPE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


export const auth = getAuth();
export const db = getFirestore(app);
export default app;
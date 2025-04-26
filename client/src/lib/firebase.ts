// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-50786.firebaseapp.com",
  projectId: "blog-app-50786",
  storageBucket: "blog-app-50786.appspot.com",
  messagingSenderId: "104153224012",
  appId: "1:104153224012:web:10ba4bedc466316bf7f5e9"};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


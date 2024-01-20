// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPKOJBEiN8bKZqa_P3tflEfuGcVoQezIs",
  authDomain: "live-oak-leads.firebaseapp.com",
  projectId: "live-oak-leads",
  storageBucket: "live-oak-leads.appspot.com",
  messagingSenderId: "462255118307",
  appId: "1:462255118307:web:1a7fd0f970707101f4b2d6"
};


// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()

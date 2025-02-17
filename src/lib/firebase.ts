// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUZf7Qy0VGFU2Hhb66PCGTBn8uiGo-VTA",
  authDomain: "autism-insight.firebaseapp.com",
  projectId: "autism-insight",
  storageBucket: "autism-insight.firebasestorage.app",
  messagingSenderId: "698882826332",
  appId: "1:698882826332:web:cdf23031d11e26b8b34699",
  measurementId: "G-XNS7M3L4FP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
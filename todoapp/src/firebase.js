// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaNoec8r0LD6dJLS8yG0ZI165du22PSjM",
  authDomain: "todoapp-9da07.firebaseapp.com",
  projectId: "todoapp-9da07",
  storageBucket: "todoapp-9da07.appspot.com",
  messagingSenderId: "837619741294",
  appId: "1:837619741294:web:9fed7724dd29de840cac7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database
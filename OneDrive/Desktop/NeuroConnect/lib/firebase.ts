import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase configuration using your actual values
const firebaseConfig = {
  apiKey: "AIzaSyCsixE1uj7zHyAjbrhvPxtu03llvESogrM",
  authDomain: "neurodivergent-fdc88.firebaseapp.com",
  projectId: "neurodivergent-fdc88",
  storageBucket: "neurodivergent-fdc88.appspot.com", // ✅ Correct bucket domain
  messagingSenderId: "1080941703225",
  appId: "1:1080941703225:web:4ae26dd6b17c2321475de8",
  measurementId: "G-NE5DJEX4GX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app)

export default app

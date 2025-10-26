// Import the necessary functions from the Firebase SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// --- Your web app's Firebase configuration ---
// IMPORTANT: It's highly recommended to use environment variables for your configuration
// to avoid exposing your API keys in the source code.
// Example: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const firebaseConfig = {
  apiKey: "AIzaSyB9umLc4yWC-fjGfkZ5AYTSezBwkoAItQE",
  authDomain: "socialmediaapp-e4e83.firebaseapp.com",
  // The databaseURL is required for the Realtime Database.
  // It's typically your-project-id-default-rtdb.firebaseio.com
  databaseURL: "https://socialmediaapp-e4e83-default-rtdb.firebaseio.com",
  projectId: "socialmediaapp-e4e83",
  storageBucket: "socialmediaapp-e4e83.appspot.com",
  messagingSenderId: "1055793271701",
  appId: "1:1055793271701:web:dee0860aebf03a2125dc9c",
};

// --- Initialize Firebase ---
// This function checks if a Firebase app is already initialized.
// In a Next.js environment, the code can run multiple times (on the server and client,
// or during hot-reloading in development). This check prevents re-initialization errors.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Export Firebase services ---
// By initializing and exporting the services here, you can easily import them
// into any component or page in your application where they are needed.

// Initialize and export Firebase Authentication
const auth = getAuth(app);

// Initialize and export Firebase Realtime Database
const db = getDatabase(app);

export { app, auth, db };

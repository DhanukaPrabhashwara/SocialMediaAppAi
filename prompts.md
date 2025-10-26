# AI Prompts Log - Social Media App Development
**AI Tool Used:** Google Gemini Code Assist in VS Code
**Developer:** Dhanuka Prabhashwara
**Date Started:** October 26, 2025

## Phase 1: Firebase Configuration

### Prompt 1 - Firebase Initialization File
**Date:** October 26, 2025, 10:20 PM
**File:** firebase.js
**Prompt:**
Role: Act as a senior Firebase engineer specializing in Next.js applications with Firebase SDK v9 modular syntax.

Task: Create a Firebase configuration and initialization file for my Next.js app.

Context: I'm building a social media web application that requires Firebase Authentication and Firebase Realtime Database. Here are my Firebase credentials:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com"
};

Constraints:
- Use Firebase SDK v9 modular syntax with named imports
- Import and initialize using initializeApp from 'firebase/app'
- Export auth instance using getAuth from 'firebase/auth'
- Export database instance using getDatabase from 'firebase/database'
- Check if Firebase is already initialized to prevent re-initialization errors
- Add detailed comments explaining each section

Output: Provide complete code for firebase.js file.
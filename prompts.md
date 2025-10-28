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
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  databaseURL: "https://PROJECT.firebaseio.com"
};

Constraints:
- Use Firebase SDK v9 modular syntax with named imports
- Import and initialize using initializeApp from 'firebase/app'
- Export auth instance using getAuth from 'firebase/auth'
- Export database instance using getDatabase from 'firebase/database'
- Check if Firebase is already initialized to prevent re-initialization errors
- Add detailed comments explaining each section

Output: Provide complete code for firebase.js file.

## Phase 2: Authentication Components

### Prompt 2 - SignUp Component
**Date:** October 26, 2025, 10:35 PM
**File:** pages/SignUp.jsx
**Prompt:**
Role: You are an expert React and Firebase Authentication developer.

Task: Generate a complete sign-up component for user registration.

Context: This is for a social media app where users create accounts with email and password. The component will use the Firebase auth instance from the firebase.js file I created earlier. This uses Next.js Pages Router (not App Router).

Constraints:
- Create a functional React component using useState and useEffect hooks
- Import { auth } from '../firebase' (adjust path as needed)
- Use createUserWithEmailAndPassword from 'firebase/auth'
- Include form with email input, password input, and submit button
- Add a "loading" state that shows while creating the account
- Display error messages if registration fails (e.g., "Email already in use", "Weak password")
- On successful registration, show success message and console.log the user ID
- Use modern JavaScript ES6+ syntax
- Add basic inline CSS styling for a clean, centered form
- Include a link to navigate to login page

Output: Provide complete code for a file named SignUp.jsx in the pages/ directory.

### Prompt 3 - Login Component
**Date:** October 26, 2025, 10:36 PM
**File:** pages/Login.jsx
**Prompt:**
Role: Act as a React developer with Firebase Authentication expertise.

Task: Create a login component that matches the style and structure of the SignUp component you just generated.

Context: This login form will work alongside the sign-up component. Users log in with their registered email and password. Use the same Firebase auth instance from firebase.js.

Constraints:
- Use signInWithEmailAndPassword from 'firebase/auth'
- Similar UI structure and styling to the SignUp component
- Include email and password input fields
- Add loading state during authentication
- Display specific error messages: "Wrong password", "User not found", "Invalid email"
- On successful login, redirect to home page (pages/index.js) using Next.js router
- Use React hooks (useState, useRouter from 'next/router')
- Include a link to navigate to sign-up page

Output: Complete code for Login.jsx in the pages/ directory.

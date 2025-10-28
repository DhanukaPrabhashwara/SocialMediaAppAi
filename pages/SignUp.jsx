import { useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust path if your firebase.js is elsewhere

const SignUp = () => {
  // State hooks for form inputs, loading status, and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /**
   * Handles the form submission to create a new user.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Use the Firebase auth function to create a user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // On success
      console.log('Successfully created user with UID:', user.uid);
      setSuccess(true);
      setEmail('');
      setPassword('');

    } catch (err) {
      // Handle specific Firebase errors
      let friendlyError = 'Failed to create an account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email address is already in use by another account.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'The password is too weak. It should be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'The email address is not valid.';
      }
      console.error("Firebase SignUp Error:", err);
      setError(friendlyError);
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  // Basic inline styles for the component
  const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' },
    form: { display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { marginBottom: '10px', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    buttonDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
    message: { marginTop: '15px', padding: '10px', borderRadius: '4px', width: '100%', textAlign: 'center' },
    error: { backgroundColor: '#ffdddd', border: '1px solid #ffaaaa', color: '#d8000c' },
    success: { backgroundColor: '#ddffdd', border: '1px solid #aaffaa', color: '#005500' },
    link: { marginTop: '15px', color: '#0070f3', textDecoration: 'none' }
  };

  return (
    <div style={styles.container}>
      <h2>Create Your Account</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {/* Display success or error messages */}
      {success && (
        <div style={{...styles.message, ...styles.success}}>
          Account created successfully! You can now log in.
        </div>
      )}
      {error && (
        <div style={{...styles.message, ...styles.error}}>
          {error}
        </div>
      )}

      <Link href="/Login" style={styles.link}>
        Already have an account? Log In
      </Link>
    </div>
  );
};

export default SignUp;
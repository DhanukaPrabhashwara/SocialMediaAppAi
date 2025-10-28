import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust path if your firebase.js is elsewhere

const Login = () => {
  // State hooks for form inputs, loading status, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js router for redirection

  /**
   * Handles the form submission to log in a user.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(null);

    try {
      // Use the Firebase auth function to sign in a user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully logged in user:', userCredential.user.uid);

      // On success, redirect to the home page
      router.push('/');

    } catch (err) {
      // Handle specific Firebase errors for a better user experience
      let friendlyError = 'Failed to log in. Please check your credentials.';
      if (err.code === 'auth/user-not-found') {
        friendlyError = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyError = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'The email address is not valid.';
      } else if (err.code === 'auth/invalid-credential') {
        // This is a more recent, generic error for wrong email or password
        friendlyError = 'Invalid credentials. Please check your email and password.';
      }
      console.error("Firebase Login Error:", err.code, err.message);
      setError(friendlyError);
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  // Re-using the same style object for a consistent look and feel
  const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' },
    form: { display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { marginBottom: '10px', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    buttonDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
    message: { marginTop: '15px', padding: '10px', borderRadius: '4px', width: '100%', textAlign: 'center' },
    error: { backgroundColor: '#ffdddd', border: '1px solid #ffaaaa', color: '#d8000c' },
    link: { marginTop: '15px', color: '#0070f3', textDecoration: 'none' }
  };

  return (
    <div style={styles.container}>
      <h2>Log In to Your Account</h2>
      <form onSubmit={handleLogin} style={styles.form}>
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
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      {/* Display error messages */}
      {error && (
        <div style={{...styles.message, ...styles.error}}>
          {error}
        </div>
      )}

      <Link href="/SignUp" style={styles.link}>
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default Login;
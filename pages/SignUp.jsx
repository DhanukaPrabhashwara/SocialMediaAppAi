import { useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import styles from '../styles/auth.module.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Successfully created user with UID:', user.uid);
      setSuccess(true);
      setEmail('');
      setPassword('');

    } catch (err) {
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
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authHeading}>Create Your Account</h2>
        <form onSubmit={handleSignUp} className={styles.authForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className={styles.authInput}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 6 characters)"
            required
            className={styles.authInput}
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.authButton}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {success && (
          <div className={`${styles.authMessage} ${styles.authSuccess}`}>
            Account created successfully! You can now log in.
          </div>
        )}
        
        {error && (
          <div className={`${styles.authMessage} ${styles.authError}`}>
            {error}
          </div>
        )}

        <div className={styles.authLink}>
          <Link href="/Login">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

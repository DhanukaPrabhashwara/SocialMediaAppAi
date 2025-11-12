import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import styles from '../styles/auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully logged in user:', userCredential.user.uid);
      
      router.push('/');

    } catch (err) {
      let friendlyError = 'Failed to log in. Please check your credentials.';
      if (err.code === 'auth/user-not-found') {
        friendlyError = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyError = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'The email address is not valid.';
      } else if (err.code === 'auth/invalid-credential') {
        friendlyError = 'Invalid credentials. Please check your email and password.';
      }
      console.error("Firebase Login Error:", err.code, err.message);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Head>
        <title>Socialo</title>
      </Head>
      <div className={styles.authCard}>
        <h2 className={styles.authHeading}>Welcome Back</h2>
        <form onSubmit={handleLogin} className={styles.authForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className={styles.authInput}
            autoComplete="off"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={styles.authInput}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.authButton}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {error && (
          <div className={`${styles.authMessage} ${styles.authError}`}>
            {error}
          </div>
        )}

        <div className={styles.authLink}>
          <Link href="/SignUp">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

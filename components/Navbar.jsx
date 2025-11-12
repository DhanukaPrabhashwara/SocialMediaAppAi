import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (href) => router.pathname === href ? 'active' : '';

  return (
    <>
      <nav>
        <div className="logo">
          <Link href="/" legacyBehavior>
            <a>Socialo</a>
          </Link>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <Link href="/" legacyBehavior>
                <a className={isActive('/')}>Home</a>
              </Link>
              <Link href="/Upload" legacyBehavior>
                <a className={isActive('/Upload')}>Upload</a>
              </Link>
              <Link href="/Feed" legacyBehavior>
                <a className={isActive('/Feed')}>Feed</a>
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/" legacyBehavior>
                <a className={isActive('/')}>Home</a>
              </Link>
              <Link href="/SignUp" legacyBehavior>
                <a className={isActive('/SignUp')}>Sign Up</a>
              </Link>
              <Link href="/Login" legacyBehavior>
                <a className={isActive('/Login')}>Login</a>
              </Link>
            </>
          )}
        </div>
      </nav>
      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #333333;
          color: white;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }
        .logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-links a,
        .logout-button {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.3s ease;
        }
        .nav-links a.active {
          color: #4A90E2;
          font-weight: bold;
          border-bottom: 2px solid #4A90E2;
          padding-bottom: 2px;
        }
        .nav-links a:not(.active):hover {
          color: #357ABD;
        }
        .logout-button {
          background: none;
          border: 1px solid white;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .logout-button:hover {
          background-color: #4a90e2;
          border-color: #4a90e2;
          color: white;
        }
        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
          }
          .nav-links {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            margin-top: 1rem;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>Welcome to Social Media App</title>
        <meta
          name="description"
          content="Share your moments with the world. Upload photos, connect with friends, and explore amazing content."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <main className="main">
          <div className="hero">
            <h1>Welcome to Social</h1>
            <p>
              Share your moments with the world. Upload photos, connect with
              friends, and explore amazing content.
            </p>
          </div>

          {!loading && (
            <div className="cta-section">
              {user ? (
                <>
                  <p className="welcome-message">Welcome, {user.email}!</p>
                  <div className="button-group">
                    <Link href="/Upload">
                      <span className="button button-loggedin">Upload Photo</span>
                    </Link>
                    <Link href="/Feed">
                      <span className="button button-loggedin">View Feed</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="cta-message">Get started today!</p>
                  <div className="button-group">
                    <Link href="/SignUp">
                      <span className="button button-primary">Sign Up</span>
                    </Link>
                    <Link href="/Login">
                      <span className="button button-secondary">Login</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #434343, #000000);
          color: white;
          text-align: center;
          padding: 20px;
        }
        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .hero p {
          font-size: 1.25rem;
          max-width: 600px;
          opacity: 0.9;
        }
        .cta-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .welcome-message,
        .cta-message {
          font-size: 1.1rem;
          font-weight: 500;
        }
        .button-group {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .button {
          display: inline-block;
          padding: 15px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 18px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          min-width: 140px;
        }
        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        .button-primary {
          background-color: #4A90E2;
          color: white;
          border: none;
        }
        .button-primary:hover {
          background-color: #357ABD;
        }
        .button-secondary {
          background-color: transparent;
          color: white;
          border: 2px solid white;
        }
        .button-secondary:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
        .button-loggedin {
          background-color: #50C878;
          color: white;
          border: none;
        }
        .button-loggedin:hover {
          background-color: #40A868;
        }
        @media (max-width: 600px) {
          .hero h1 {
            font-size: 2.5rem;
          }
          .button-group {
            flex-direction: column;
            width: 100%;
          }
          .button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

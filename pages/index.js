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
                    <Link href="/Upload" className="button">
                      Upload Photo
                    </Link>
                    <Link href="/Feed" className="button">
                      View Feed
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="cta-message">Get started today!</p>
                  <div className="button-group">
                    <Link href="/SignUp" className="button">
                      Sign Up
                    </Link>
                    <Link href="/Login" className="button">
                      Login
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
          background: linear-gradient(135deg, #4a90e2, #50c878);
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
        }
        .button {
          background-color: white;
          color: #333;
          padding: 12px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        @media (max-width: 600px) {
          .hero h1 {
            font-size: 2.5rem;
          }
          .button-group {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

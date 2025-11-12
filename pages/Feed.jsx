import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ref, query, onValue, orderByChild } from 'firebase/database';
import { database } from '../lib/firebase';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const postsRef = ref(database, 'posts');
    const postsQuery = query(postsRef, orderByChild('timestamp'));

    const unsubscribe = onValue(
      postsQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const postsData = [];
          snapshot.forEach((childSnapshot) => {
            postsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setPosts(postsData.reverse());
        } else {
          setPosts([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching posts:', err);
        setError('Failed to load the feed. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const styles = {
    feedContainer: { maxWidth: '800px', margin: '0px auto', padding: '0 20px', fontFamily: 'sans-serif' },
    header: { marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: {
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      background: 'rgba(24, 24, 24, 0.45)', // translucent dark
      backdropFilter: 'blur(10px)',          // the glass blur
      WebkitBackdropFilter: 'blur(10px)',    // for Safari
      transition: 'background 0.3s, box-shadow 0.3s',
    },
    author: { fontSize: '0.8em', color: '#cfcfcfff', padding: '10px 15px 0 15px', fontWeight: 500, letterSpacing: '0.01em' },
    imageWrapper: { padding: '10px 10px 0 10px' },
    image: { width: '100%', height: '300px', objectFit: 'cover', display: 'block', borderRadius: '6px' },
    captionContainer: { padding: '15px' },
    caption: { margin: '0 0 10px 0' },
    timestamp: { fontSize: '0.8em', color: '#888' },
    message: { textAlign: 'center', color: '#555', fontSize: '1.2em', padding: '40px 0' },
  };

  if (loading) {
    return <div style={styles.message}>Loading feed...</div>;
  }

  if (error) {
    return <div style={{ ...styles.message, color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #434343, #000000)',
      width: '100%',
      color: 'white',
    }}>
      <Head>
        <title>Socialo</title>
      </Head>
      <div style={styles.feedContainer}>
        <h1 style={styles.header}>Feed</h1>
        {posts.length === 0 ? (
          <div style={styles.message}>No posts yet. Be the first to upload!</div>
        ) : (
          <div style={styles.grid}>
            {posts.map((post) => (
              <div key={post.id} style={styles.card}>
                {/* Author styled like timestamp */}
                <div style={styles.author}>
                  {post.userEmail || "Unknown author"}
                </div>
                {/* Space between card border and image */}
                <div style={styles.imageWrapper}>
                  <img src={post.imageUrl} alt={post.caption || 'User post'} style={styles.image} />
                </div>
                <div style={styles.captionContainer}>
                  <p style={styles.caption}>{post.caption}</p>
                  <small style={styles.timestamp}>
                    {formatTimestamp(post.timestamp)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
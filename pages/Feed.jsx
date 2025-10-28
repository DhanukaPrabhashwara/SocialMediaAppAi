import { useState, useEffect } from 'react';
import { ref, query, onValue, orderByChild } from 'firebase/database';
import { database } from '../lib/firebase';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const postsRef = ref(database, 'posts');
    // Query to order posts by timestamp. Firebase sorts in ascending order.
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
          // Reverse the array to show newest posts first
          setPosts(postsData.reverse());
        } else {
          setPosts([]); // Handle case where there are no posts
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching posts:', err);
        setError('Failed to load the feed. Please try again later.');
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Helper to format the timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Basic inline styles
  const styles = {
    feedContainer: { maxWidth: '800px', margin: '20px auto', padding: '0 20px', fontFamily: 'sans-serif' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    image: { width: '100%', height: '300px', objectFit: 'cover' },
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
    <div style={styles.feedContainer}>
      <h1>Feed</h1>
      {posts.length === 0 ? (
        <div style={styles.message}>No posts yet. Be the first to upload!</div>
      ) : (
        <div style={styles.grid}>
          {posts.map((post) => (
            <div key={post.id} style={styles.card}>
              <img src={post.imageUrl} alt={post.caption || 'User post'} style={styles.image} />
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
  );
};

export default Feed;
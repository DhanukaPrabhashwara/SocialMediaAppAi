import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { auth, database } from '../lib/firebase';

const Upload = () => {
  // State for form inputs and component status
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // ImgBB API Key
  const IMGBB_API_KEY = '4d8db2bad20c776e0c4d06790936d722';

  /**
   * Handles the file input change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
   */
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  /**
   * Handles the form submission for uploading the image and creating a post.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }
    if (!auth.currentUser) {
      setError('You must be logged in to upload a post.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    // 1. Convert image to base64 for ImgBB API
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      // 2. Upload to ImgBB
      const formData = new FormData();
      formData.append('image', base64Image);

      try {
        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });

        const imgbbResult = await imgbbResponse.json();

        if (!imgbbResult.success) {
          throw new Error(imgbbResult.error?.message || 'Image upload to ImgBB failed.');
        }

        const imageUrl = imgbbResult.data.url;

        // 3. Save post data to Firebase Realtime Database
        const postData = {
          imageUrl,
          caption,
          timestamp: serverTimestamp(), // Use server timestamp for consistency
          userId: auth.currentUser.uid,
        };

        const postsRef = ref(database, 'posts');
        await push(postsRef, postData);

        setSuccess('Post uploaded successfully!');
        // Reset form
        setCaption('');
        setImage(null);
        e.target.reset();

      } catch (err) {
        console.error('Upload failed:', err);
        setError(`Upload failed. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the image file.');
      setLoading(false);
    };
  };

  // Basic inline styles
  const styles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: 'sans-serif' },
    form: { display: 'flex', flexDirection: 'column', width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    input: { marginBottom: '15px', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' },
    button: { padding: '12px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    buttonDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
    message: { marginTop: '15px', padding: '10px', borderRadius: '4px', width: '100%', textAlign: 'center' },
    error: { backgroundColor: '#ffdddd', border: '1px solid #ffaaaa', color: '#d8000c' },
    success: { backgroundColor: '#ddffdd', border: '1px solid #aaffaa', color: '#005500' },
  };

  return (
    <div style={styles.container}>
      <h2>Create a New Post</h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <input type="file" accept="image/*" onChange={handleImageChange} required style={styles.input} />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows="4"
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}>
          {loading ? 'Uploading...' : 'Upload Post'}
        </button>
      </form>
      {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
      {success && <div style={{ ...styles.message, ...styles.success }}>{success}</div>}
    </div>
  );
};

export default Upload;
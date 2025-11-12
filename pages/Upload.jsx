import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { ref, push, serverTimestamp } from 'firebase/database';
import { auth, database } from '../lib/firebase';
import styles from '../styles/auth.module.css';

const Upload = () => {
  // States for caption, image file, loading, error, success, and image preview
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  // ImgBB API Key
  const IMGBB_API_KEY = '4d8db2bad20c776e0c4d06790936d722';

  // Handle image file selection and create preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload handler using ImgBB API and saving to Firebase Realtime DB
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

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

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

        const postData = {
          imageUrl,
          caption,
          timestamp: serverTimestamp(),
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
        };

        const postsRef = ref(database, 'posts');
        await push(postsRef, postData);

        setSuccess('Post uploaded successfully!');
        setCaption('');
        setImage(null);
        setPreview(null);
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

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authHeading}>Create a New Post</h2>
        <form onSubmit={handleUpload} className={styles.authForm}>
          <button
            type="button"
            className={styles.mediaButton}
            onClick={() => fileInputRef.current.click()}
          >
            <svg height="20" width="20" fill="#4A90E2" viewBox="0 0 24 24">
              <path d="M12 5v14m7-7H5" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Media
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            required
            className={styles.mediaInput}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview of selected"
              style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '15px', borderRadius: '8px' }}
            />
          )}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows="4"
            className={styles.authInput}
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.authButton}
          >
            {loading ? 'Uploading...' : 'Upload Post'}
          </button>
        </form>
        {error && (
          <div className={`${styles.authMessage} ${styles.authError}`}>{error}</div>
        )}
        {success && (
          <div className={`${styles.authMessage} ${styles.authSuccess}`}>
            {success}
            <button
              type="button"
              onClick={() => router.push('/Feed')}
              className={styles.authButton}
              style={{ marginTop: '15px', width: '100%' }}
            >
              See The Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './InstagramGallery.module.css';
import { fetchInstagramMedia } from '../utils/instagram';

export default function InstagramGallery() {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInstagramMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const media = await fetchInstagramMedia('eventsbytoyo');
        // Transform the data to match our component's expected structure
        const transformedMedia = media.map(post => ({
          id: post.id,
          imageUrl: post.media_url,
          caption: post.caption,
          likes: post.like_count || 0,
          type: post.media_type,
          permalink: post.permalink,
          timestamp: post.timestamp
        }));
        setInstagramPosts(transformedMedia);
      } catch (error) {
        console.error('Error loading Instagram media:', error);
        setError('Failed to load Instagram posts');
        // Fallback to mock data if there's an error
        setInstagramPosts([
          {
            id: '1',
            imageUrl: '/image.png',
            caption: 'Beautiful wedding setup for Willie & Donna 💕 #wedding #eventsbytoyo',
            likes: 124,
            type: 'image'
          },
          {
            id: '2',
            imageUrl: '/image.png',
            caption: 'Corporate event excellence at downtown venue 🏢 #corporateevents #eventsbytoyo',
            likes: 89,
            type: 'image'
          },
          {
            id: '3',
            imageUrl: '/image.png',
            caption: 'Birthday celebration magic! 🎉 #birthday #eventsbytoyo',
            likes: 156,
            type: 'image'
          },
          {
            id: '4',
            imageUrl: '/image.png',
            caption: 'Anniversary dinner setup ✨ #anniversary #eventsbytoyo',
            likes: 97,
            type: 'image'
          },
          {
            id: '5',
            imageUrl: '/image.png',
            caption: 'Product launch event success! 🚀 #productlaunch #eventsbytoyo',
            likes: 203,
            type: 'image'
          },
          {
            id: '6',
            imageUrl: '/image.png',
            caption: 'Graduation party celebration 🎓 #graduation #eventsbytoyo',
            likes: 76,
            type: 'image'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadInstagramMedia();
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className={styles.galleryContainer}>
        <h2 className={styles.galleryTitle}>Follow Us On Instagram</h2>
        <p className={styles.gallerySubtitle}>@eventsbytoyo</p>
        <div className={styles.loading}>Loading Instagram posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.galleryContainer}>
        <h2 className={styles.galleryTitle}>Follow Us On Instagram</h2>
        <p className={styles.gallerySubtitle}>@eventsbytoyo</p>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <h2 className={styles.galleryTitle}>Follow Us On Instagram</h2>
      <p className={styles.gallerySubtitle}>@eventsbytoyo</p>
      
      <div className={styles.instagramGrid}>
        {instagramPosts.map((post) => (
          <div 
            key={post.id} 
            className={styles.instagramItem}
            onClick={() => openModal(post)}
          >
            <Image
              src={post.imageUrl}
              alt={post.caption}
              width={300}
              height={300}
              className={styles.instagramImage}
              unoptimized
            />
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <span>♥ {post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeButton} onClick={closeModal}>&times;</span>
            <Image
              src={selectedPost.imageUrl}
              alt={selectedPost.caption}
              width={600}
              height={600}
              className={styles.modalImage}
              unoptimized
            />
            <div className={styles.modalInfo}>
              <p>{selectedPost.caption}</p>
              <div className={styles.postStats}>
                <span>♥ {selectedPost.likes} likes</span>
              </div>
              {selectedPost.permalink && (
                <a 
                  href={selectedPost.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.instagramLink}
                >
                  View on Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
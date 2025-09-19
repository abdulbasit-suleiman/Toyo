'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [goToNext]);


  // Check if the current slide is a video
  const isVideo = slides[currentIndex]?.url?.endsWith('.mp4');

  return (
    <div className={styles.slider}>
      <div className={styles.slide}>
        {isVideo ? (
          <video 
            src={slides[currentIndex].url} 
            alt={slides[currentIndex].title || "Slider video"} 
            className={styles.image}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image 
            src={slides[currentIndex].url || '/image.png'} 
            alt={slides[currentIndex].title || "Slider image"} 
            fill
            priority
            className={styles.image}
            unoptimized
            onError={(e) => {
              // Fallback to a default image if the image fails to load
              e.target.src = '/image.png';
            }}
          />
        )}
        {slides[currentIndex].title && (
          <div className={styles.caption}>
            <h2>{slides[currentIndex].title}</h2>
            <p>{slides[currentIndex].description}</p>
          </div>
        )}
      </div>
      
      {/* Removed slider arrows as requested */}
      
      <div className={styles.dotsContainer}>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={`${styles.dot} ${slideIndex === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(slideIndex)}
          >
            &#8226;
          </div>
        ))}
      </div>
    </div>
  );
}
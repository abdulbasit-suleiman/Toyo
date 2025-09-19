'use client';

import { useState } from 'react';
import styles from './ImageUploader.module.css';

export default function ImageUploader({ onUpload, section }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(section, selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploader}>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*,video/*" 
        className={styles.fileInput}
        id={`file-${section}`}
      />
      <label htmlFor={`file-${section}`} className={styles.fileLabel}>
        {selectedFile ? selectedFile.name : 'Choose file'}
      </label>
      <button 
        onClick={handleUpload} 
        disabled={isUploading || !selectedFile}
        className={styles.uploadButton}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
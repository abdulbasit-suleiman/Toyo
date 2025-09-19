'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '../utils/firebase';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ImageUploader from '../components/ImageUploader';
import styles from './admin.module.css';

export default function AdminPage() {
  const [headings, setHeadings] = useState({
    mainHeader: 'Events By Toyo',
    headerSubtitle: 'Premium Event Planning Services',
    aboutHeader: 'About Us',
    servicesHeader: 'Our Event Services',
    portfolioHeader: 'Our Portfolio',
    whyUsHeader: 'Why Choose Events By Toyo',
    contactHeader: 'Let\'s Plan Your Event',
    packagesHeader: 'Event Planning Packages'
  });

  const [sections, setSections] = useState({
    about: '',
    services: '',
    contact: '',
    packages: ''
  });

  const [theme, setTheme] = useState({
    primaryColor: '#e91e63',
    secondaryColor: '#c2185b',
    backgroundColor: '#f9f9f9',
    textColor: '#333333',
    accentColor: '#4CAF50'
  });

  // Wedding invitation theme colors (from the view page source)
  const [weddingTheme, setWeddingTheme] = useState({
    primaryColor: '#d4af37', // Gold
    secondaryColor: '#8b0000', // Dark red
    backgroundColor: '#fffaf0', // Floral white
    textColor: '#333333',
    accentColor: '#8b0000' // Dark red
  });

  const [useWeddingTheme, setUseWeddingTheme] = useState(false);

  const [slides, setSlides] = useState([
    {
      url: "/1.mp4",
      title: "Creating Magical Moments",
      description: "Experience the magic of unforgettable events"
    },
    {
      url: "/1.mp4",
      title: "Elegant Wedding Planning",
      description: "Crafting beautiful weddings tailored to your vision"
    }
  ]);

  const [uploadedImages, setUploadedImages] = useState({});

  useEffect(() => {
    // Load saved data from localStorage if available
    const savedHeadings = localStorage.getItem('adminHeadings');
    const savedSections = localStorage.getItem('adminSections');
    const savedTheme = localStorage.getItem('adminTheme');
    const savedSlides = localStorage.getItem('adminSlides');
    const savedImages = localStorage.getItem('adminImages');
    const savedUseWeddingTheme = localStorage.getItem('useWeddingTheme');
    
    if (savedHeadings) {
      setHeadings(JSON.parse(savedHeadings));
    }
    
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
    
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
    
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides));
    }
    
    if (savedImages) {
      setUploadedImages(JSON.parse(savedImages));
    }
    
    if (savedUseWeddingTheme) {
      setUseWeddingTheme(JSON.parse(savedUseWeddingTheme));
    }
  }, []);

  const handleHeadingChange = (e, key) => {
    setHeadings(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const handleSectionChange = (e, key) => {
    setSections(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const handleThemeChange = (e, key) => {
    const newTheme = {
      ...theme,
      [key]: e.target.value
    };
    setTheme(newTheme);
  };

  const handleWeddingThemeChange = (e, key) => {
    const newTheme = {
      ...weddingTheme,
      [key]: e.target.value
    };
    setWeddingTheme(newTheme);
  };

  const toggleTheme = () => {
    setUseWeddingTheme(!useWeddingTheme);
    localStorage.setItem('useWeddingTheme', JSON.stringify(!useWeddingTheme));
  };

  const handleSlideChange = (index, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value
    };
    setSlides(updatedSlides);
  };

  const addSlide = () => {
    setSlides(prev => [
      ...prev,
      {
        url: "",
        title: "",
        description: ""
      }
    ]);
  };

  const removeSlide = (index) => {
    if (slides.length > 1) {
      const updatedSlides = slides.filter((_, i) => i !== index);
      setSlides(updatedSlides);
    }
  };

  const saveHeadings = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('adminHeadings', JSON.stringify(headings));
      
      // Save to Firebase
      if (db) {
        await setDoc(doc(db, "settings", "headings"), headings);
      } else {
        console.warn('Firebase not initialized. Data saved to localStorage only.');
        alert('Headings saved locally. Firebase not connected.');
        return;
      }
      
      alert('Headings saved successfully!');
    } catch (error) {
      console.error("Error saving headings: ", error);
      alert('Error saving headings: ' + error.message);
    }
  };

  const saveSections = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('adminSections', JSON.stringify(sections));
      
      // Save to Firebase
      if (db) {
        await setDoc(doc(db, "settings", "sections"), sections);
      }
      
      alert('Section content saved successfully!');
    } catch (error) {
      console.error("Error saving sections: ", error);
      alert('Error saving sections: ' + error.message);
    }
  };

  const saveTheme = async () => {
    try {
      const themeData = {
        default: theme,
        wedding: weddingTheme,
        useWeddingTheme: useWeddingTheme
      };
      
      // Save to localStorage
      localStorage.setItem('adminTheme', JSON.stringify(theme));
      localStorage.setItem('adminWeddingTheme', JSON.stringify(weddingTheme));
      localStorage.setItem('useWeddingTheme', JSON.stringify(useWeddingTheme));
      
      // Save to Firebase
      if (db) {
        await setDoc(doc(db, "settings", "theme"), themeData);
      }
      
      alert('Theme saved successfully!');
    } catch (error) {
      console.error("Error saving theme: ", error);
      alert('Error saving theme: ' + error.message);
    }
  };

  const saveSlides = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('adminSlides', JSON.stringify(slides));
      
      // Save to Firebase
      if (db) {
        await setDoc(doc(db, "settings", "slides"), { slides });
      }
      
      alert('Slides saved successfully!');
    } catch (error) {
      console.error("Error saving slides: ", error);
      alert('Error saving slides: ' + error.message);
    }
  };

  const saveUploadedImages = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('adminImages', JSON.stringify(uploadedImages));
      
      // Save to Firebase
      if (db) {
        await setDoc(doc(db, "settings", "images"), uploadedImages);
      }
      
      alert('Uploaded images saved successfully!');
    } catch (error) {
      console.error("Error saving images: ", error);
      alert('Error saving images: ' + error.message);
    }
  };

  const handleImageUpload = async (section, file) => {
    try {
      // Upload to Firebase Storage
      if (storage) {
        const storageRef = ref(storage, `images/${section}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Update state with the Firebase URL
        const imageInfo = {
          name: file.name,
          url: downloadURL,
          type: file.type,
          size: file.size
        };
        
        setUploadedImages(prev => ({
          ...prev,
          [section]: imageInfo
        }));
        
        alert(`Image uploaded successfully for ${section} section!`);
      } else {
        alert('Firebase Storage is not initialized');
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert('Error uploading image: ' + error.message);
    }
  };

  const loadFromFirebase = async () => {
    try {
      if (!db) {
        alert('Firebase is not initialized');
        return;
      }
      
      // Load headings
      const headingsDoc = await getDoc(doc(db, "settings", "headings"));
      if (headingsDoc.exists()) {
        setHeadings(headingsDoc.data());
      }
      
      // Load sections
      const sectionsDoc = await getDoc(doc(db, "settings", "sections"));
      if (sectionsDoc.exists()) {
        setSections(sectionsDoc.data());
      }
      
      // Load theme
      const themeDoc = await getDoc(doc(db, "settings", "theme"));
      if (themeDoc.exists()) {
        const themeData = themeDoc.data();
        setTheme(themeData.default || theme);
        setWeddingTheme(themeData.wedding || weddingTheme);
        setUseWeddingTheme(themeData.useWeddingTheme || false);
      }
      
      // Load slides
      const slidesDoc = await getDoc(doc(db, "settings", "slides"));
      if (slidesDoc.exists()) {
        setSlides(slidesDoc.data().slides || slides);
      }
      
      // Load images
      const imagesDoc = await getDoc(doc(db, "settings", "images"));
      if (imagesDoc.exists()) {
        setUploadedImages(imagesDoc.data());
      }
      
      alert('Data loaded successfully from Firebase!');
    } catch (error) {
      console.error("Error loading data: ", error);
      alert('Error loading data: ' + error.message);
    }
  };

  const currentTheme = useWeddingTheme ? weddingTheme : theme;

  return (
    <div className={styles.adminPage}>
      <header className={styles.adminHeader}>
        <h1>Events By Toyo - Admin Panel</h1>
      </header>

      <main className={styles.adminMain}>
        <section className={styles.section}>
          <h2>Firebase Controls</h2>
          <div className={styles.formGroup}>
            <button onClick={loadFromFirebase} className={styles.loadButton}>
              Load Data from Firebase
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Edit Headings</h2>
          <div className={styles.formGroup}>
            <label>Main Header:</label>
            <input 
              type="text" 
              value={headings.mainHeader} 
              onChange={(e) => handleHeadingChange(e, 'mainHeader')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Header Subtitle:</label>
            <input 
              type="text" 
              value={headings.headerSubtitle} 
              onChange={(e) => handleHeadingChange(e, 'headerSubtitle')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>About Section Header:</label>
            <input 
              type="text" 
              value={headings.aboutHeader} 
              onChange={(e) => handleHeadingChange(e, 'aboutHeader')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Services Section Header:</label>
            <input 
              type="text" 
              value={headings.servicesHeader} 
              onChange={(e) => handleHeadingChange(e, 'servicesHeader')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Portfolio Section Header:</label>
            <input 
              type="text" 
              value={headings.portfolioHeader} 
              onChange={(e) => handleHeadingChange(e, 'portfolioHeader')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Why Us Section Header:</label>
            <input 
              type="text" 
              value={headings.whyUsHeader} 
              onChange={(e) => handleHeadingChange(e, 'whyUsHeader')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Contact Section Header:</label>
            <input 
              type="text" 
              value={headings.contactHeader} 
              onChange={(e) => handleHeadingChange(e, 'contactHeader')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Packages Section Header:</label>
            <input 
              type="text" 
              value={headings.packagesHeader} 
              onChange={(e) => handleHeadingChange(e, 'packagesHeader')}
              className={styles.input}
            />
          </div>
          
          <button onClick={saveHeadings} className={styles.saveButton}>
            Save Headings
          </button>
        </section>

        <section className={styles.section}>
          <h2>Edit Section Content</h2>
          <div className={styles.formGroup}>
            <label>About Section Content:</label>
            <textarea 
              value={sections.about} 
              onChange={(e) => handleSectionChange(e, 'about')}
              className={styles.textarea}
              rows="4"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Services Section Content:</label>
            <textarea 
              value={sections.services} 
              onChange={(e) => handleSectionChange(e, 'services')}
              className={styles.textarea}
              rows="4"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Contact Section Content:</label>
            <textarea 
              value={sections.contact} 
              onChange={(e) => handleSectionChange(e, 'contact')}
              className={styles.textarea}
              rows="4"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Packages Section Content:</label>
            <textarea 
              value={sections.packages} 
              onChange={(e) => handleSectionChange(e, 'packages')}
              className={styles.textarea}
              rows="4"
            />
          </div>
          
          <button onClick={saveSections} className={styles.saveButton}>
            Save Section Content
          </button>
        </section>

        <section className={styles.section}>
          <h2>Customize Theme</h2>
          
          <div className={styles.formGroup}>
            <button 
              onClick={toggleTheme} 
              className={useWeddingTheme ? styles.toggleButtonActive : styles.toggleButton}
            >
              {useWeddingTheme ? 'Using Wedding Theme' : 'Use Wedding Theme'}
            </button>
          </div>
          
          <h3>{useWeddingTheme ? 'Wedding Theme Colors' : 'Default Theme Colors'}</h3>
          
          <div className={styles.formGroup}>
            <label>Primary Color:</label>
            <div className={styles.colorInputContainer}>
              <input 
                type="color" 
                value={currentTheme.primaryColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'primaryColor') 
                  : handleThemeChange(e, 'primaryColor')}
                className={styles.colorInput}
              />
              <input 
                type="text" 
                value={currentTheme.primaryColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'primaryColor') 
                  : handleThemeChange(e, 'primaryColor')}
                className={styles.colorTextInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Secondary Color:</label>
            <div className={styles.colorInputContainer}>
              <input 
                type="color" 
                value={currentTheme.secondaryColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'secondaryColor') 
                  : handleThemeChange(e, 'secondaryColor')}
                className={styles.colorInput}
              />
              <input 
                type="text" 
                value={currentTheme.secondaryColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'secondaryColor') 
                  : handleThemeChange(e, 'secondaryColor')}
                className={styles.colorTextInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Background Color:</label>
            <div className={styles.colorInputContainer}>
              <input 
                type="color" 
                value={currentTheme.backgroundColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'backgroundColor') 
                  : handleThemeChange(e, 'backgroundColor')}
                className={styles.colorInput}
              />
              <input 
                type="text" 
                value={currentTheme.backgroundColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'backgroundColor') 
                  : handleThemeChange(e, 'backgroundColor')}
                className={styles.colorTextInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Text Color:</label>
            <div className={styles.colorInputContainer}>
              <input 
                type="color" 
                value={currentTheme.textColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'textColor') 
                  : handleThemeChange(e, 'textColor')}
                className={styles.colorInput}
              />
              <input 
                type="text" 
                value={currentTheme.textColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'textColor') 
                  : handleThemeChange(e, 'textColor')}
                className={styles.colorTextInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Accent Color:</label>
            <div className={styles.colorInputContainer}>
              <input 
                type="color" 
                value={currentTheme.accentColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'accentColor') 
                  : handleThemeChange(e, 'accentColor')}
                className={styles.colorInput}
              />
              <input 
                type="text" 
                value={currentTheme.accentColor} 
                onChange={(e) => useWeddingTheme 
                  ? handleWeddingThemeChange(e, 'accentColor') 
                  : handleThemeChange(e, 'accentColor')}
                className={styles.colorTextInput}
              />
            </div>
          </div>
          
          <button onClick={saveTheme} className={styles.saveButton}>
            Save Theme
          </button>
        </section>

        <section className={styles.section}>
          <h2>Hero Slider</h2>
          {slides.map((slide, index) => (
            <div key={index} className={styles.slideContainer}>
              <h3>Slide {index + 1}</h3>
              <div className={styles.formGroup}>
                <label>Media URL:</label>
                <input 
                  type="text" 
                  value={slide.url} 
                  onChange={(e) => handleSlideChange(index, 'url', e.target.value)}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input 
                  type="text" 
                  value={slide.title} 
                  onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea 
                  value={slide.description} 
                  onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                  className={styles.textarea}
                  rows="3"
                />
              </div>
              
              {slides.length > 1 && (
                <button 
                  onClick={() => removeSlide(index)} 
                  className={styles.removeButton}
                >
                  Remove Slide
                </button>
              )}
            </div>
          ))}
          
          <button onClick={addSlide} className={styles.addButton}>
            Add New Slide
          </button>
          
          <button onClick={saveSlides} className={styles.saveButton}>
            Save Slides
          </button>
        </section>

        <section className={styles.section}>
          <h2>Upload Images</h2>
          <div className={styles.uploadSection}>
            <h3>Hero Slider Images</h3>
            <ImageUploader onUpload={handleImageUpload} section="hero" />
          </div>
          
          <div className={styles.uploadSection}>
            <h3>About Section Image</h3>
            <ImageUploader onUpload={handleImageUpload} section="about" />
          </div>
          
          <div className={styles.uploadSection}>
            <h3>Services Section Images</h3>
            <ImageUploader onUpload={handleImageUpload} section="services" />
          </div>
          
          <div className={styles.uploadSection}>
            <h3>Portfolio Gallery Images</h3>
            <ImageUploader onUpload={handleImageUpload} section="portfolio" />
          </div>
          
          <div className={styles.uploadSection}>
            <h3>Event Packages Image</h3>
            <ImageUploader onUpload={handleImageUpload} section="packages" />
          </div>
          
          <button onClick={saveUploadedImages} className={styles.saveButton}>
            Save Uploaded Images
          </button>
        </section>
      </main>
    </div>
  );
}
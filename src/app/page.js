'use client';

import { useState, useEffect } from 'react';
import { db } from './utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from "next/image";
import styles from "./page.module.css";
import ImageSlider from "./components/ImageSlider";
import ChatAssistant from "./components/ChatAssistant";
import InstagramGallery from "./components/InstagramGallery";

export default function Home() {
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

  const [theme, setTheme] = useState({
    primaryColor: '#e91e63',
    secondaryColor: '#c2185b',
    backgroundColor: '#f9f9f9',
    textColor: '#333333',
    accentColor: '#4CAF50'
  });

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
      url: "/image.png",
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
    if (savedHeadings) {
      setHeadings(JSON.parse(savedHeadings));
    }

    // Load saved theme from localStorage if available
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }

    // Load wedding theme from localStorage if available
    const savedWeddingTheme = localStorage.getItem('adminWeddingTheme');
    if (savedWeddingTheme) {
      setWeddingTheme(JSON.parse(savedWeddingTheme));
    }

    // Load theme preference from localStorage if available
    const savedUseWeddingTheme = localStorage.getItem('useWeddingTheme');
    if (savedUseWeddingTheme) {
      setUseWeddingTheme(JSON.parse(savedUseWeddingTheme));
    }

    // Load saved slides from localStorage if available
    const savedSlides = localStorage.getItem('adminSlides');
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides));
    }

    // Load saved images from localStorage if available
    const savedImages = localStorage.getItem('adminImages');
    if (savedImages) {
      setUploadedImages(JSON.parse(savedImages));
    }

    // Set up real-time listeners for Firebase data if db is available
    let unsubscribeHeadings, unsubscribeTheme, unsubscribeSlides, unsubscribeImages;
    
    if (db) {
      try {
        unsubscribeHeadings = onSnapshot(doc(db, "settings", "headings"), (doc) => {
          if (doc.exists()) {
            setHeadings(doc.data());
            localStorage.setItem('adminHeadings', JSON.stringify(doc.data()));
          }
        }, (error) => {
          console.error("Error listening to headings:", error);
        });

        unsubscribeTheme = onSnapshot(doc(db, "settings", "theme"), (doc) => {
          if (doc.exists()) {
            const themeData = doc.data();
            setTheme(themeData.default || theme);
            setWeddingTheme(themeData.wedding || weddingTheme);
            setUseWeddingTheme(themeData.useWeddingTheme || false);
            localStorage.setItem('adminTheme', JSON.stringify(themeData.default || theme));
            localStorage.setItem('adminWeddingTheme', JSON.stringify(themeData.wedding || weddingTheme));
            localStorage.setItem('useWeddingTheme', JSON.stringify(themeData.useWeddingTheme || false));
          }
        }, (error) => {
          console.error("Error listening to theme:", error);
        });

        unsubscribeSlides = onSnapshot(doc(db, "settings", "slides"), (doc) => {
          if (doc.exists()) {
            setSlides(doc.data().slides || slides);
            localStorage.setItem('adminSlides', JSON.stringify(doc.data().slides || slides));
          }
        }, (error) => {
          console.error("Error listening to slides:", error);
        });

        unsubscribeImages = onSnapshot(doc(db, "settings", "images"), (doc) => {
          if (doc.exists()) {
            setUploadedImages(doc.data());
            localStorage.setItem('adminImages', JSON.stringify(doc.data()));
          }
        }, (error) => {
          console.error("Error listening to images:", error);
        });
      } catch (error) {
        console.error("Error setting up Firestore listeners:", error);
      }
    }

    // Clean up listeners on unmount
    return () => {
      if (unsubscribeHeadings) unsubscribeHeadings();
      if (unsubscribeTheme) unsubscribeTheme();
      if (unsubscribeSlides) unsubscribeSlides();
      if (unsubscribeImages) unsubscribeImages();
    };
  }, [slides, theme, weddingTheme, useWeddingTheme]);

  useEffect(() => {
    // Apply theme to CSS variables
    const currentTheme = useWeddingTheme ? weddingTheme : theme;
    document.documentElement.style.setProperty('--primary-color', currentTheme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', currentTheme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', currentTheme.textColor);
    document.documentElement.style.setProperty('--accent-color', currentTheme.accentColor);
  }, [theme, weddingTheme, useWeddingTheme]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Calligraphic Header */}
        <div className={styles.headerSection}>
          <h1 className={styles.calligraphicHeader}>{headings.mainHeader}</h1>
          <p className={styles.headerSubtitle}>{headings.headerSubtitle}</p>
        </div>
        
        {/* Hero Section with Image Slider */}
        <ImageSlider slides={slides} />
        
        {/* About Us Section */}
        <div className={styles.aboutSection} id="about">
          <div className={styles.sectionHeader}>
            <h2>{headings.aboutHeader}</h2>
            <div className={styles.heartDivider}>♥</div>
          </div>
          
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>
                Events By Toyo is a premier event planning company dedicated to creating unforgettable experiences. 
                With years of experience in the industry, we specialize in weddings, corporate events, and social celebrations.
              </p>
              <p>
                Our team of creative professionals works closely with each client to bring their vision to life, 
                ensuring every detail is perfect. We believe that every event is unique and deserves personalized attention.
              </p>
              <p>
                From intimate gatherings to large-scale celebrations, we handle all the planning and coordination 
                so you can enjoy your special occasion stress-free.
              </p>
            </div>
            
            <div className={styles.aboutImage}>
              {uploadedImages.about ? (
                <Image 
                  src={uploadedImages.about.url} 
                  alt="Events By Toyo Team" 
                  width={400} 
                  height={300} 
                  className={styles.image}
                />
              ) : (
                <Image
                  src="/image.png"
                  alt="Events By Toyo Team"
                  width={400}
                  height={300}
                  className={styles.image}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Services Section */}
        <div className={styles.servicesSection} id="services">
          <div className={styles.sectionHeader}>
            <h2>{headings.servicesHeader}</h2>
            <div className={styles.heartDivider}>♥</div>
          </div>
          
          <div className={styles.servicesContainer}>
            {/* Wedding Planning */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                {uploadedImages.services ? (
                  <Image 
                    src={uploadedImages.services.url} 
                    alt="Wedding Planning" 
                    width={300} 
                    height={200} 
                    className={styles.image}
                  />
                ) : (
                  <Image
                    src="/image.png"
                    alt="Wedding Planning"
                    width={300}
                    height={200}
                    className={styles.image}
                  />
                )}
              </div>
              <h3>Wedding Planning</h3>
              <p className={styles.serviceDescription}>
                Full-service wedding planning to make your special day perfect in every detail.
              </p>
            </div>
            
            {/* Corporate Events */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                {uploadedImages.services ? (
                  <Image 
                    src={uploadedImages.services.url} 
                    alt="Corporate Events" 
                    width={300} 
                    height={200} 
                    className={styles.image}
                  />
                ) : (
                  <Image
                    src="/image.png"
                    alt="Corporate Events"
                    width={300}
                    height={200}
                    className={styles.image}
                  />
                )}
              </div>
              <h3>Corporate Events</h3>
              <p className={styles.serviceDescription}>
                Professional planning for conferences, product launches, and corporate celebrations.
              </p>
            </div>
            
            {/* Social Celebrations */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                {uploadedImages.services ? (
                  <Image 
                    src={uploadedImages.services.url} 
                    alt="Social Celebrations" 
                    width={300} 
                    height={200} 
                    className={styles.image}
                  />
                ) : (
                  <Image
                    src="/image.png"
                    alt="Social Celebrations"
                    width={300}
                    height={200}
                    className={styles.image}
                  />
                )}
              </div>
              <h3>Social Celebrations</h3>
              <p className={styles.serviceDescription}>
                Custom birthday parties, anniversaries, and milestone celebrations.
              </p>
            </div>
          </div>
          
          <button className={styles.quoteButton}>Get Free Quote</button>
        </div>
        
        {/* Portfolio Gallery */}
        <div className={styles.gallerySection} id="portfolio">
          <div className={styles.sectionHeader}>
            <h2>{headings.portfolioHeader}</h2>
            <p>Explore our recent successful events and see the magic we create</p>
            <div className={styles.heartDivider}>♥</div>
          </div>
          
          <InstagramGallery />
        </div>
        
        {/* Why Choose Us */}
        <div className={styles.storySection} id="why-us">
          <div className={styles.sectionHeader}>
            <h2>{headings.whyUsHeader}</h2>
            <p>We transform your vision into unforgettable experiences</p>
          </div>
          
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <h3>Comprehensive Planning</h3>
              <div className={styles.heartDivider}>♥</div>
              <p>End-to-end event planning services for weddings, corporate events, and social celebrations.</p>
            </div>
            
            <div className={styles.timelineItem}>
              <h3>Creative Design</h3>
              <div className={styles.heartDivider}>♥</div>
              <p>Innovative design concepts tailored to your vision and style preferences.</p>
            </div>
            
            <div className={styles.timelineItem}>
              <h3>Stress-Free Experience</h3>
              <div className={styles.heartDivider}>♥</div>
              <p>We handle all the details so you can enjoy your special occasion worry-free.</p>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className={styles.rsvpSection} id="contact">
          <div className={styles.videoIcon}>
            <span>&#9742;</span>
          </div>
          
          <div className={styles.rsvpContent}>
            <h2>{headings.contactHeader}</h2>
            <p>Contact us today to discuss your event needs and get a customized quote</p>
            <div className={styles.heartDivider}>♥</div>
            
            <form className={styles.rsvpForm}>
              <div className={styles.formRow}>
                <input type="text" placeholder="First name" className={styles.formInput} />
                <input type="text" placeholder="Last name" className={styles.formInput} />
              </div>
              <input type="email" placeholder="Email address" className={styles.formInput} />
              <select className={styles.formSelect} defaultValue="">
                <option value="" disabled>Type of Event</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="birthday">Birthday Party</option>
                <option value="anniversary">Anniversary</option>
                <option value="babyShower">Baby Shower</option>
                <option value="graduation">Graduation</option>
                <option value="other">Other</option>
              </select>
              <textarea placeholder="Tell us about your event" className={styles.formTextarea}></textarea>
              <button type="submit" className={styles.submitButton}>SEND INQUIRY</button>
            </form>
          </div>
        </div>
        
        {/* Event Packages */}
        <div className={styles.eventSection} id="packages">
          <div className={styles.sectionHeader}>
            <h1>{headings.packagesHeader}</h1>
            <h2>Choose the perfect plan for your event</h2>
          </div>
          
          <div className={styles.eventsContainer}>
            <div className={styles.eventCard}>
              <h3>Essential Package</h3>
              <div className={styles.divider}></div>
              <p>Ideal for intimate gatherings</p>
              <ul className={styles.packageFeatures}>
                <li>Venue recommendations</li>
                <li>Basic decoration ideas</li>
                <li>Vendor coordination</li>
                <li>Timeline planning</li>
              </ul>
              <p className={styles.packagePrice}>Starting at $500</p>
            </div>
            
            <div className={styles.eventCard}>
              <h3>Complete Package</h3>
              <div className={styles.divider}></div>
              <p>Perfect for weddings and large events</p>
              <ul className={styles.packageFeatures}>
                <li>Full event design</li>
                <li>Venue selection & booking</li>
                <li>All vendor management</li>
                <li>Day-of coordination</li>
                <li>Custom invitations</li>
              </ul>
              <p className={styles.packagePrice}>Starting at $2,500</p>
            </div>
          </div>
          
          <div className={styles.eventImage}>
            {uploadedImages.packages ? (
              <Image 
                src={uploadedImages.packages.url} 
                alt="Event Planning Success" 
                width={500} 
                height={500} 
                className={styles.image}
              />
            ) : (
              <Image
                src="/image.png"
                alt="Event Planning Success"
                width={500}
                height={500}
                className={styles.image}
              />
            )}
          </div>
          
          <h3 className={styles.expectingText}>Let Us Create Your Perfect Event</h3>
          
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon}>f</a>
            <a href="#" className={styles.socialIcon}>t</a>
            <a href="#" className={styles.socialIcon}>y</a>
            <a href="#" className={styles.socialIcon}>i</a>
          </div>
          
          <div className={styles.divider}></div>
          
          <a href="#" className={styles.liveLink}>View Our Complete Portfolio</a>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <a href="#about">
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
            unoptimized
          />
          About Us
        </a>
        <a href="#services">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            unoptimized
          />
          Services
        </a>
        <a href="#contact">
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
            unoptimized
          />
          Contact
        </a>
      </footer>
      
      <ChatAssistant />
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ChatAssistant.module.css';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Events By Toyo assistant. How can I help you plan your event today?",
      isBot: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse.response,
        isBot: true,
        image: botResponse.image
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Special case: Access admin page
    if (lowerInput.includes('onlyonetoyo')) {
      // Redirect to admin page
      window.location.href = '/admin';
      return {
        response: "Redirecting you to the admin page...",
        image: null
      };
    }
    
    // Simple keyword matching for responses
    if (lowerInput.includes('wedding')) {
      return {
        response: "We specialize in wedding planning! Our Complete Package includes full event design, venue selection, vendor management, and day-of coordination. Would you like to know more about our wedding services?",
        image: "/image.png"
      };
    } else if (lowerInput.includes('corporate') || lowerInput.includes('business')) {
      return {
        response: "Our corporate event services include conferences, product launches, and company celebrations. We handle everything from venue selection to AV equipment. Would you like details about our corporate packages?",
        image: "/image.png"
      };
    } else if (lowerInput.includes('birthday') || lowerInput.includes('party')) {
      return {
        response: "We create memorable birthday celebrations and parties! Our Social Celebrations service covers custom themes, entertainment, and all the details to make your event special. Would you like to know about our party planning options?",
        image: "/image.png"
      };
    } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('package')) {
      return {
        response: "We offer two main packages: Essential Package starting at $500 for intimate gatherings, and Complete Package starting at $2,500 for weddings and large events. Each package can be customized to your needs. Would you like more details about either package?",
        image: "/image.png"
      };
    } else if (lowerInput.includes('gallery') || lowerInput.includes('portfolio') || lowerInput.includes('instagram')) {
      return {
        response: "Check out our Instagram gallery to see examples of our recent events! We regularly post photos from weddings, corporate events, and social celebrations. Would you like me to show you some specific event types?",
        image: "/image.png"
      };
    } else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('call')) {
      return {
        response: "You can reach us by filling out the contact form on our website, or by calling us at (555) 123-4567. We're available Monday through Friday, 9am to 6pm. How would you prefer to get in touch?",
        image: null
      };
    } else if (lowerInput.includes('thank')) {
      return {
        response: "You're welcome! Is there anything else I can help you with regarding your event planning?",
        image: null
      };
    } else {
      return {
        response: "Thanks for your message! I'm here to help with all your event planning needs. You can ask me about our services, packages, or how to get started. What would you like to know?",
        image: null
      };
    }
  };

  return (
    <div className={styles.chatContainer}>
      {isOpen ? (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <h3>Events By Toyo Assistant</h3>
            <button onClick={toggleChat} className={styles.closeButton}>×</button>
          </div>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
              >
                {message.text}
                {message.image && message.isBot && (
                  <div className={styles.messageImageContainer}>
                    <Image
                      src={message.image}
                      alt="Event example"
                      width={200}
                      height={200}
                      className={styles.messageImage}
                    />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputContainer}>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className={styles.inputField}
              rows="2"
            />
            <button onClick={handleSend} className={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <button onClick={toggleChat} className={styles.chatButton}>
          💬
        </button>
      )}
    </div>
  );
}
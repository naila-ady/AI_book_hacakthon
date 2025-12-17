import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Using HTTP instead of WebSocket for better compatibility across environments
  const sendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      // Determine API URL based on environment using a more flexible approach
      // Check if we're in browser and use appropriate URL
      const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      // Define the backend URL - in production, this needs to be updated to your actual backend URL
      // For local development, use local backend; for production, use deployed backend
      let backendUrl;
      if (isLocalhost) {
        backendUrl = 'http://127.0.0.1:8000'; // Local development
      } else {
        // For production deployment, use your Railway backend URL
        backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://aibookhacakthon-production.up.railway.app';
      }

      const apiUrl = `${backendUrl}/api/v1/query`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }), // Backend expects 'query' field, not 'message'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add the AI response to messages
      const text = data.answer || data.response || data.message || 'No response received';
      const sources = data.sources?.join(', ') || 'None';
      setMessages(prev => [...prev,
        { text: input, sender: 'user' },
        { text: `${text}\n\nSources: ${sources}`, sender: 'ai' }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Provide more user-friendly error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setMessages(prev => [...prev, {
          text: 'Error: Unable to connect to the backend server. Please make sure:\n1. The backend server is running\n2. The backend URL is correctly configured\n3. The server is accessible from your network',
          sender: 'system'
        }]);
      } else {
        setMessages(prev => [...prev, { text: `Error: ${error.message || 'Failed to send message'}`, sender: 'system' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      // Add user message immediately
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      sendMessage(input);
      setInput('');
    }
  };

  // Check if backend is available
  const checkBackendStatus = async () => {
    try {
      // Determine API URL based on environment
      const isLocalhost = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      let backendUrl;
      if (isLocalhost) {
        backendUrl = 'http://127.0.0.1:8000'; // Local development
      } else {
        // For production deployment, use your Railway backend URL
        backendUrl = 'https://aibookhacakthon-production.up.railway.app';
      }

      const healthUrl = `${backendUrl}/health`;
      const response = await fetch(healthUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleDelete = () => setMessages([]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <button onClick={handleDelete} className={styles.headerButton}>Delete Chat</button>
        <div className={styles.statusIndicator}>
          <span className={`${styles.statusDot} ${isLoading ? styles.statusThinking : styles.statusReady}`}></span>
          {isLoading ? 'AI Assistant: Thinking...' : 'AI Assistant: Ready'}
        </div>
      </div>

      <div className={styles.chatbotMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.sender === 'ai' ? styles.bot : msg.sender === 'user' ? styles.user : styles.system}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.bot}`}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatbotInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
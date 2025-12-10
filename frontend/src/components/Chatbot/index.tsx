import React, { useState } from 'react';
import styles from './styles.module.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // TODO: Add logic to send message to AI and receive a response
    }
  };

  const handleDelete = () => {
    setMessages([]);
  };

  const handleConnect = () => {
    // TODO: Add logic to connect to AI
    console.log('Connect to AI');
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <button onClick={handleDelete} className={styles.headerButton}>Delete Chat</button>
        <button onClick={handleConnect} className={styles.headerButton}>AI assistant</button>
      </div>
      <div className={styles.chatbotMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.chatbotInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

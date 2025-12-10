// import React, { useState, useEffect, useRef } from 'react';
// import styles from './styles.module.css';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const websocket = useRef<WebSocket | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const connectToWebSocket = () => {
//     const wsUrl = 'ws://127.0.0.1:8001';

//     if (websocket.current && websocket.current.readyState === WebSocket.OPEN) return;

//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log('WebSocket connected successfully.');
//       setIsConnected(true);
//       setMessages(prev => [...prev, { text: 'Connected to AI assistant.', sender: 'system' }]);
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       if (message.type === 'response') {
//         setMessages(prev => [...prev, { text: message.message, sender: 'ai' }]);
//       } else if (message.type === 'keep-alive') {
//         // Ignore keep-alive messages
//         return;
//       } else if (message.type === 'error') {
//         setMessages(prev => [...prev, { text: `Error: ${message.message}`, sender: 'system' }]);
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket disconnected.');
//       setIsConnected(false);
//       setMessages(prev => [...prev, { text: 'Disconnected from AI assistant.', sender: 'system' }]);
//       websocket.current = null;
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setIsConnected(false);
//       setMessages(prev => [...prev, { text: 'Connection error.', sender: 'system' }]);
//     };

//     websocket.current = ws;
//   };

//   useEffect(() => {
//     connectToWebSocket();

//     return () => {
//       websocket.current?.close();
//     };
//   }, []);

//   const handleSend = () => {
//     if (input.trim() && websocket.current && websocket.current.readyState === WebSocket.OPEN) {
//       websocket.current.send(JSON.stringify({ type: 'message', content: input }));
//       setMessages(prev => [...prev, { text: input, sender: 'user' }]);
//       setInput('');
//     } else if (!isConnected) {
//       setMessages(prev => [...prev, { text: 'Not connected. Please connect first.', sender: 'system' }]);
//     }
//   };

//   const handleDelete = () => setMessages([]);

//   const handleConnect = () => {
//     if (!websocket.current || websocket.current.readyState === WebSocket.CLOSED) {
//       connectToWebSocket();
//     }
//   };

//   return (
//     <div className={styles.chatbotContainer}>
//       <div className={styles.chatbotHeader}>
//         <button onClick={handleDelete} className={styles.headerButton}>Delete Chat</button>
//         <button 
//           onClick={handleConnect} 
//           className={`${styles.headerButton} ${isConnected ? styles.connected : ''}`}
//         >
//           {isConnected ? 'AI Assistant: Connected' : 'AI Assistant: Disconnected'}
//         </button>
//       </div>

//       <div className={styles.chatbotMessages}>
//         {messages.map((msg, index) => (
//           <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
//             {msg.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className={styles.chatbotInput}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//           placeholder={isConnected ? "Type your message..." : "Connect to the AI to chat"}
//           disabled={!isConnected}
//         />
//         <button onClick={handleSend} disabled={!isConnected}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const websocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectToWebSocket = () => {
    const wsUrl = 'ws://127.0.0.1:8001';
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setMessages(prev => [...prev, { text: 'Connected to AI assistant.', sender: 'system' }]);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'response') {
        const text = message.message;
        const sources = message.sources?.join(', ');
        setMessages(prev => [...prev, { text: `${text}\n\nSources: ${sources}`, sender: 'ai' }]);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    websocket.current = ws;
  };

  useEffect(() => {
    connectToWebSocket();
    return () => { websocket.current?.close(); };
  }, []);

  const handleSend = () => {
    if (input.trim() && websocket.current?.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify({ type: 'message', content: input }));
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

  const handleDelete = () => setMessages([]);

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <button onClick={handleDelete} className={styles.headerButton}>Delete Chat</button>
      </div>

      <div className={styles.chatbotMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatbotInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isConnected ? "Type your message..." : "Connecting..."}
          disabled={!isConnected}
        />
        <button onClick={handleSend} disabled={!isConnected}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

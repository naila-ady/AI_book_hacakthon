# Chatbot Creation Agent

## Purpose
This agent provides a complete template and workflow for creating a functional chatbot system with WebSocket communication, RAG (Retrieval Augmented Generation) capabilities, and proper frontend integration.

## Agent Workflow

### 1. Project Structure Setup
```
project_root/
├── backend/
│   ├── chatbot-backend/
│   │   ├── app/
│   │   │   ├── services/
│   │   │   │   └── rag_service.py
│   │   │   └── ... other backend files
│   │   ├── chat_server.py
│   │   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── components/
│   │       └── Chatbot/
│   │           ├── index.tsx
│   │           └── styles.module.css
├── .env
└── ... other project files
```

### 2. Backend Implementation

#### 2.1 Create chat_server.py
```python
import asyncio
import websockets
import json
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.services.rag_service import RAGService

# ----------------- Logging Setup -----------------
log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

file_handler = logging.FileHandler('websocket_server.log')
file_handler.setFormatter(log_formatter)
logger.addHandler(file_handler)

# ----------------- Initialize RAG Service -----------------
# Use collection name from environment variable, default to "bookn"
collection_name = os.getenv("QDRANT_COLLECTION", "bookn")
rag_service = RAGService(collection_name=collection_name)
rag_service.initialize_collection()
logger.info("RAGService initialized and collection ready.")

# ----------------- WebSocket Handler -----------------
async def handle_connection(websocket):
    logger.info(f"Client connected {websocket.remote_address}")

    try:
        while True:
            try:
                # Wait for message from client
                msg = await asyncio.wait_for(websocket.recv(), timeout=10)
                logger.info(f"Received: {msg}")

                if msg:
                    data = json.loads(msg)
                    if data.get("type") == "message":
                        user_query = data.get("content", "")
                        # Query Qdrant via RAGService
                        response = rag_service.query(user_query)

                        # Send back the answer and sources
                        await websocket.send(json.dumps({
                            "type": "response",
                            "message": response.get("answer", ""),
                            "sources": response.get("sources", [])
                        }))

            except asyncio.TimeoutError:
                # Keep-alive ping to prevent disconnect
                await websocket.send(json.dumps({"type": "keep-alive"}))
                logger.info("Sent keep-alive")

    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client disconnected: {websocket.remote_address}")
    except Exception as e:
        logger.error(f"WebSocket Error: {e}", exc_info=True)

# ----------------- Main Server -----------------
async def main():
    server = await websockets.serve(
        handle_connection,
        "127.0.0.1",
        8001
    )
    logger.info("WebSocket server started on ws://127.0.0.1:8001")
    await server.wait_closed()

# ----------------- Run -----------------
if __name__ == "__main__":
    asyncio.run(main())
```

#### 2.2 Create rag_service.py
```python
import os
from typing import List, Dict, Any, Tuple
import cohere
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from dotenv import load_dotenv
import logging

load_dotenv()  # Load .env

class RAGService:
    def __init__(self, collection_name: str = "bookn"):
        COHERE_API_KEY = os.getenv("COHERE_API_KEY")
        QDRANT_URL = os.getenv("QDRANT_URL")
        QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

        if not COHERE_API_KEY or not QDRANT_URL:
            raise ValueError("Cohere API key and Qdrant URL must be set.")

        self.cohere_client = cohere.Client(api_key=COHERE_API_KEY)
        self.qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        self.collection_name = collection_name

    def initialize_collection(self):
        try:
            # Try to get the collection first
            self.qdrant_client.get_collection(collection_name=self.collection_name)
            print(f"Collection {self.collection_name} already exists.")
        except Exception as e:
            # If it doesn't exist, create it
            try:
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
                )
                print(f"Created collection {self.collection_name}")
            except Exception as create_error:
                # If creation fails due to collection already existing, that's fine
                if "already exists" in str(create_error):
                    print(f"Collection {self.collection_name} already exists.")
                else:
                    print(f"Error creating collection: {create_error}")
                    raise create_error

    def get_embedding(self, text: str) -> List[float]:
        resp = self.cohere_client.embed(
            texts=[text],
            model="embed-english-v3.0",
            input_type="search_document"
        )
        return resp.embeddings[0]

    def search_and_retrieve_chunks(
        self,
        query: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        query_embedding = self.get_embedding(query)
        # Use the correct method name for the Qdrant client version
        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        return [hit.payload for hit in results if hit.payload]

    def generate_answer(
        self,
        question: str,
        context_chunks: List[Dict[str, Any]]
    ) -> Tuple[str, List[Dict[str, Any]]]:
        if not context_chunks:
            return "I don't have enough information to answer that question.", []

        # Build the prompt manually (combine content and instructions)
        prompt = "You are a helpful assistant for the 'Physical AI and Humanoid Robotics' book.\n"
        prompt += "Answer questions using only the following book snippets. Cite the source file.\n\n"

        for chunk in context_chunks:
            content = chunk.get("content", "")
            source = chunk.get("file_path", "Unknown Source")
            prompt += f"Content from {source}:\n{content}\n\n"

        prompt += f"Question: {question}\nAnswer:"

        try:
            # Use the correct Cohere API call without specifying a deprecated model
            response = self.cohere_client.chat(
                message=prompt,
                max_tokens=500
            )
            answer = response.text.strip()
        except Exception as e:
            # Fallback response if Cohere API fails
            logger = logging.getLogger(__name__)
            logger.error(f"Cohere API error: {e}")
            answer = f"Sorry, I encountered an error processing your request: {str(e)}"

        return answer, context_chunks

    def query(self, query: str) -> Dict[str, Any]:
        retrieved_chunks = self.search_and_retrieve_chunks(query)
        answer, cited_documents = self.generate_answer(query, retrieved_chunks)
        sources = [doc.get("file_path", "Unknown") for doc in cited_documents]
        return {"answer": answer, "sources": list(set(sources))}
```

### 3. Frontend Implementation

#### 3.1 Create Chatbot Component (index.tsx)
```tsx
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
```

#### 3.2 Create Styles (styles.module.css)
```css
.chatbotContainer {
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.chatbotHeader {
  background-color: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}

.headerButton {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.connected {
  background-color: #28a745;
}

.chatbotMessages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.message {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  max-width: 80%;
}

.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.ai {
  align-self: flex-start;
  background-color: #e9ecef;
  color: black;
}

.system {
  align-self: center;
  background-color: #6c757d;
  color: white;
  font-style: italic;
}

.chatbotInput {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}

.chatbotInput input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.chatbotInput input:disabled {
  background-color: #e9ecef;
}

.chatbotInput button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.chatbotInput button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
```

### 4. Configuration Files

#### 4.1 Create .env file
```
# Qdrant configuration
QDRANT_URL=your_qdrant_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION=book_content

# Cohere API Key for embeddings and RAG
COHERE_API_KEY=your_cohere_api_key_here

# Debug mode (true/false)
DEBUG=true
```

#### 4.2 Create requirements.txt
```
websockets
cohere
qdrant-client
python-dotenv
```

### 5. Testing Implementation

#### 5.1 Create test script
```python
import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://127.0.0.1:8001"

    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket server")

            # Send a test message
            test_message = {
                "type": "message",
                "content": "Hello, how are you?"
            }

            await websocket.send(json.dumps(test_message))
            print(f"Sent: {test_message}")

            # Wait for response
            response = await asyncio.wait_for(websocket.recv(), timeout=10)
            print(f"Received: {response}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
```

### 6. Startup Instructions
1. Install backend dependencies: `pip install -r requirements.txt`
2. Set up environment variables in `.env`
3. Start the WebSocket server: `cd backend/chatbot-backend && python chat_server.py`
4. Start the frontend application
5. The chatbot will be accessible through the frontend interface

### 7. Key Points to Remember
- WebSocket server runs on `ws://127.0.0.1:8001`
- Frontend connects to the WebSocket server automatically
- RAG service handles document retrieval and AI response generation
- Proper error handling for API failures with graceful fallbacks
- Environment variables for configuration
- Message format consistency between frontend and backend
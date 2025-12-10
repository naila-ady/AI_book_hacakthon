# Tasks: Chatkit MCP Chatbot Implementation

**Feature**: `chatkit-mcp-chatbot`
**Version**: 1.0
**Status**: Proposed

## 1. Setup and Environment Configuration

- [ ] Task 1.1: Ensure `websockets` library is installed (`pip install websockets`).
- [ ] Task 1.2: Ensure `qdrant-client` and `cohere` libraries are installed.
- [ ] Task 1.3: Verify `.env` file exists in the project root with `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION`, and `COHERE_API_KEY` configured.

## 2. Core WebSocket Server Implementation

- [ ] Task 2.1: Create a new Python file (e.g., `chat_server.py`) in `backend/chatbot-backend/` or `backend/` for the WebSocket server.
- [ ] Task 2.2: Implement basic WebSocket server using `websockets` and `asyncio`.
    - [ ] Task 2.2.1: Define `async def handle_connection(websocket, path):` function.
    - [ ] Task 2.2.2: Implement `asyncio.run(websockets.serve(...))` to start the server.
- [ ] Task 2.3: Implement message receiving loop within `handle_connection`.
    - [ ] Task 2.3.1: Parse incoming JSON messages (`{ "type": "message", "content": "..." }`).
- [ ] Task 2.4: Implement a basic echo response mechanism for initial testing.
    - [ ] Task 2.4.1: Send JSON responses back to the client (`{ "type": "response", "content": "You said: ..." }`).

## 3. RAG Integration

- [ ] Task 3.1: Create or adapt a RAGService class (similar to `app/services/rag_service.py`) for the WebSocket server context.
    - [ ] Task 3.1.1: Ensure it correctly initializes Qdrant and Cohere clients using `Config` (from `.env`).
    - [ ] Task 3.1.2: Implement `get_embedding` method.
    - [ ] Task 3.1.3: Implement `search_and_retrieve_chunks` method.
    - [ ] Task 3.1.4: Implement `generate_answer` method.
- [ ] Task 3.2: Integrate the RAGService into the WebSocket server's message handling.
    - [ ] Task 3.2.1: When a user message is received, call `rag_service.query()`.
    - [ ] Task 3.2.2: Format the RAG response for sending back to the client.

## 4. Book Documentation Indexing

- [ ] Task 4.1: Develop a script (e.g., `index_book_docs.py`) to parse book documentation.
    - [ ] Task 4.1.1: Locate markdown files in `frontend/docs/`.
    - [ ] Task 4.1.2: Implement text extraction and chunking logic for markdown files.
- [ ] Task 4.2: Index the parsed chunks into Qdrant.
    - [ ] Task 4.2.1: Generate embeddings for each chunk using Cohere `embed`.
    - [ ] Task 4.2.2: Store chunks and their embeddings in the configured Qdrant collection.

## 5. Testing and Validation

- [ ] Task 5.1: Manual testing of WebSocket connectivity using a simple client (e.g., Python `websockets` client script or browser developer tools).
- [ ] Task 5.2: Manual testing of RAG responses with sample queries related to book content.
- [ ] Task 5.3: Verify that source citations are included in RAG responses.

## 6. Connection Instructions

- [ ] Task 6.1: Document steps to start the WebSocket server.
- [ ] Task 6.2: Provide example client code (e.g., Python script) to connect to the WebSocket server.

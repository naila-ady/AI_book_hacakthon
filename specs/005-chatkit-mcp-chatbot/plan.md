# Plan: Chatkit MCP Chatbot Implementation

**Feature**: `chatkit-mcp-chatbot`
**Version**: 1.0
**Status**: Proposed

## 1. Scope and Dependencies

### In Scope:
-   Establish a WebSocket-based server for basic chat interactions.
-   Implement message receiving and sending functionalities.
-   Integrate with a RAG (Retrieval-Augmented Generation) mechanism to answer questions from the book documentation.
-   Provide clear instructions for connecting a client.

### Out of Scope:
-   Complex NLP, advanced AI responses (beyond RAG integration).
-   User authentication and authorization.
-   Persistent chat history.
-   Frontend client development (focus on backend server).

### External Dependencies:
-   Python `websockets` library.
-   `asyncio` for asynchronous operations.
-   `qdrant-client` for vector database operations.
-   `cohere` for embeddings and LLM generation.
-   Existing book documentation files (`frontend/docs/`).

## 2. Key Decisions and Rationale

### Decision 1: Server Framework Choice
-   **Options Considered**: FastAPI with WebSockets, raw `websockets` library, `RServer` (from provided context).
-   **Decision**: Utilize the `websockets` library directly, similar to the `RServer` concept.
-   **Rationale**: Provides a lightweight and efficient foundation for a chat server that aligns with existing patterns and the real-time, interactive nature of a chat application.

### Decision 2: Communication Protocol
-   **Decision**: WebSockets.
-   **Rationale**: Provides full-duplex, persistent connection suitable for real-time chat interactions, offering lower latency compared to polling HTTP requests.

### Decision 3: Knowledge Base Integration (RAG)
-   **Decision**: Integrate a RAG system using Qdrant for vector storage and Cohere for embeddings and LLM generation.
-   **Rationale**: Leverages existing technology choices within the project (as seen in the `backend/chatbot-backend`) and allows the chatbot to provide contextually relevant answers from the book documentation without being trained directly on it. This addresses the user's requirement for the bot to answer from "book docs folder chapters".

## 3. Interfaces and API Contracts

### WebSocket Endpoint:
-   **URL**: `ws://127.0.0.1:8000/ws/chat` (example)
-   **Client to Server Messages**: JSON object `{ "type": "message", "content": "What is physical AI?" }`
-   **Server to Client Messages**: JSON object `{ "type": "response", "content": "Based on the book, physical AI is..." }`

## 4. Non-Functional Requirements (NFRs) and Budgets

-   **Performance**: Target <5 seconds latency for RAG-based responses; <100ms for simple acknowledgements.
-   **Accuracy**: RAG responses should be factually consistent with the book's content and cite sources.
-   **Reliability**: The server should be stable and handle multiple concurrent connections.
-   **Scalability**: Design for single-server deployment initially, with architectural consideration for horizontal scaling.

## 5. Data Management and Migration

-   **Data**: Book documentation content will be processed and stored as embeddings in Qdrant. No persistent storage for chat messages in this initial phase.
-   **State**: Per-connection state managed by the WebSocket handler.
-   **Migration**: Initial indexing of book documentation into Qdrant will be a one-time setup task.

## 6. Operational Readiness

-   **Observability**: Basic server logging for connection events, message processing, and RAG component interactions.
-   **Deployment**: Standard Python script execution (`python chat_server.py`).

## 7. Risk Analysis and Mitigation

-   **Risk**: Complexity of `asyncio` and RAG integration for developers unfamiliar with it.
-   **Mitigation**: Provide clear code examples, modularize RAG components (e.g., reuse `RAGService`), and detailed documentation.
-   **Risk**: Potential for connection drops/unhandled errors in WebSocket communication.
-   **Mitigation**: Implement robust error handling and client reconnection logic.
-   **Risk**: RAG accuracy and relevance if source documents are not properly chunked/indexed.
-   **Mitigation**: Iterative testing with sample queries and refinement of chunking strategy.

## 8. Evaluation and Validation

-   **Definition of Done**: A working WebSocket server that can send messages and provide RAG-based answers from book documentation.
-   **Output Validation**: Client receives expected RAG responses, including cited sources.

## 9. Architectural Decision Record (ADR)

-   Not applicable for this initial plan; will suggest ADRs for significant architectural shifts later.

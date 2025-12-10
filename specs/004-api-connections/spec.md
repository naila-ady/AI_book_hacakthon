# Spec: API Connections

**Feature**: `api-connections`
**Version**: 1.0
**Status**: Documented

## 1. Overview

This document provides details on how to connect to and interact with the FastAPI backend API for the AI Robotics Book Chatbot.

## 2. Backend Server Access

When the FastAPI backend server is running locally, it is accessible via the following URLs:

-   **Base URL**: `http://127.0.0.1:8000/`
-   **API Documentation (Swagger UI)**: `http://127.0.0.1:8000/docs`
-   **Health Check**: `http://127.0.0.1:8000/health`
-   **Query Endpoint**: `http://127.0.0.1:8000/api/v1/query` (POST request)

## 3. Query Endpoint Usage

The `/api/v1/query` endpoint expects a JSON body with the following structure:

```json
{
  "query": "Your question here",
  "selected_text": "Optional selected text for contextual queries"
}
```

Example PowerShell command to query the API:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/query" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{ "query": "What is physical AI?" }'
```

---

# AI Robotics Book RAG Chatbot Integration

## 1. Overview

This section integrates the requirements for the RAG (Retrieval-Augmented Generation) chatbot. The chatbot allows readers to ask questions about the book's content and receive contextually relevant answers.

## 2. User Stories

### User Story 1: General Queries
**As a** reader,
**I want to** ask the chatbot general questions about the book's content,
**So that** I can quickly find information and clarify concepts without manually searching the text.

**Acceptance Criteria:**
- A chatbot interface is available on the book's website.
- The user can type a question into the chatbot.
- The chatbot returns an answer based on the content of the entire book.
- The chatbot cites the source document(s) (e.g., chapter or section) from which the answer was derived.
- The response is generated in a timely manner (e.g., within a few seconds).

### User Story 2: Contextual Queries with Selected Text
**As a** reader,
**I want to** select a specific passage of text and ask the chatbot a question about it,
**So that** I can get a highly specific answer based on the immediate context I am reading.

**Acceptance Criteria:**
- The user can highlight a section of text in the book.
- A button or context menu appears, allowing the user to "Ask about this".
- The chatbot interface opens with the selected text as context.
- The user can ask a question related to the selected text.
- The chatbot's answer gives priority to the selected text as context.
- If the answer cannot be found in the selected text, the chatbot may use the rest of the book as a fallback and should indicate this.

## 3. Non-Functional Requirements

- **Performance**: The chatbot should respond to queries within 5 seconds.
- **Accuracy**: The chatbot's answers should be factually consistent with the book's content.
- **Usability**: The chatbot interface should be intuitive and easy to use.
- **Availability**: The backend service should be highly available.

## 4. Technical Stack

- **Frontend**: Docusaurus (React)
- **Backend**: FastAPI (Python)
- **Vector Database**: Qdrant
- **Embedding Model**: Cohere
- **LLM for Generation**: Cohere
# Backend Deployment to Railway Specification

## Overview
This specification documents the process of deploying the backend API for the AI Robotics Book Chatbot to Railway, enabling the chatbot functionality to work independently of local development servers.

## Problem Statement
The chatbot functionality on the website was dependent on local backend servers running on port 8000, making it unavailable when the local servers were not running. The Vercel frontend was attempting to connect to a Railway URL that was not yet deployed.

## Solution
Deploy the FastAPI backend to Railway to provide a stable, publicly accessible API endpoint for the chatbot functionality.

## Technical Requirements

### Backend Configuration
- **Framework**: FastAPI
- **Deployment Method**: Railway using Dockerfile and Procfile
- **Environment Variables**:
  - QDRANT_URL: Cloud Qdrant instance
  - QDRANT_API_KEY: Authentication key for Qdrant
  - QDRANT_COLLECTION: "bookn" collection
  - COHERE_API_KEY: Cohere API key for NLP processing
  - GEMINI_API_KEY: Google Gemini API key
  - DATABASE_URL: PostgreSQL connection string for Railway

### Deployment Files
- **Procfile**: `web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}`
- **runtime.txt**: `python-3.11.5`
- **requirements.txt**: FastAPI, uvicorn, cohere, qdrant-client, psycopg2-binary, etc.
- **Dockerfile**: Multi-stage build with Python 3.11-slim base image

## Deployment Process

### 1. Prerequisites
- Railway CLI installed (`npm install -g @railway/cli`)
- Valid Railway account with login (`railway login`)

### 2. Project Setup
- Navigate to `backend/chatbot-backend` directory
- Run `railway link` to connect to existing project or `railway init` for new project
- Ensure environment variables are properly configured in Railway dashboard

### 3. Deployment Command
- Run `railway up` to build and deploy the application
- Railway automatically handles Docker build and deployment process

### 4. Frontend Integration
- Frontend already configured to connect to `https://aibookhacakthon-production.up.railway.app`
- No additional frontend changes required after successful backend deployment

## Architecture

### Backend Components
- **FastAPI Application**: Main application server
- **RAG Service**: Retrieval Augmented Generation for document-based Q&A
- **Qdrant Integration**: Vector database for document embeddings
- **Cohere Integration**: Natural language processing
- **PostgreSQL**: Database hosted on Railway

### API Endpoints
- `GET /` - Root endpoint
- `GET /health` - Health check endpoint
- `GET /qdrant-test` - Qdrant connection test
- `POST /api/v1/query` - Main chatbot query endpoint

## Security Considerations
- Environment variables stored securely in Railway
- CORS middleware configured to allow connections from frontend
- API keys not exposed in client-side code

## Environment Variables Required
- `QDRANT_URL`: Cloud Qdrant instance URL
- `QDRANT_API_KEY`: Qdrant authentication key
- `QDRANT_COLLECTION`: Collection name ("bookn")
- `COHERE_API_KEY`: Cohere API key
- `GEMINI_API_KEY`: Google Gemini API key
- `DATABASE_URL`: PostgreSQL connection string (provided by Railway)

## Verification Steps
1. Deploy backend using `railway up`
2. Verify deployment at Railway URL
3. Test health endpoint (`/health`)
4. Test Qdrant connection (`/qdrant-test`)
5. Verify frontend can connect to backend API
6. Test chatbot functionality on website

## Impact
- Chatbot functionality becomes available without local servers
- Improved reliability and uptime
- Better user experience with persistent backend service
- Scalable infrastructure managed by Railway

## Monitoring
- Railway provides built-in monitoring and logging
- Health check endpoint available for status monitoring
- Error logging through Railway dashboard
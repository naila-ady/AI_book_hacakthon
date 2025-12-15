# Deployment Guide

This guide explains how to deploy the AI Chatbot application with a hybrid approach: frontend on Vercel and backend on Render.

## Architecture Overview

The application uses a hybrid deployment approach:
- **Frontend**: Deployed on Vercel as a static Docusaurus site
- **Backend**: Deployed on Render as a WebSocket server
- **Communication**: Frontend connects to backend via WebSocket

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- Vercel CLI installed (optional)

### Steps

1. **Prepare Environment Variables**
   - Before deployment, you'll need the backend URL from Render deployment
   - Set `NEXT_PUBLIC_WEBSOCKET_URL` to your Render backend URL (e.g., `wss://your-app-name.onrender.com`)

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Import your GitHub repository
   - Configure the project with:
     - Framework: `Docusaurus`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add environment variable:
     - `NEXT_PUBLIC_WEBSOCKET_URL`: Your Render backend URL (use `ws://localhost:8001` for development)

3. **Connect to GitHub**
   - Link your GitHub repository to Vercel
   - Enable automatic deployments on push to main branch

## Backend Deployment (Render)

### Prerequisites
- Render account
- External access to Qdrant database (not on local network)

### Steps

1. **Prepare Repository**
   - Ensure your repository contains the `backend/chatbot-backend/` directory
   - The directory should contain:
     - `chat_server.py` (main application)
     - `requirements.txt` (dependencies)
     - `Procfile` (process configuration)
     - `runtime.txt` (Python version)
     - `app/` directory (application code)

2. **Deploy to Render**
   - Go to [render.com](https://render.com) and sign in
   - Create a new Web Service
   - Connect to your GitHub repository
   - Configure as follows:
     - Environment: `Python`
     - Branch: `main`
     - Root Directory: `backend/chatbot-backend`
     - Runtime: Should be detected from `runtime.txt`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `python chat_server.py`
     - Port: Should be read from `PORT` environment variable (handled in code)

3. **Set Environment Variables**
   - `QDRANT_URL`: URL for your Qdrant instance
   - `QDRANT_API_KEY`: API key for Qdrant (if required)
   - `QDRANT_COLLECTION`: Collection name (default: `bookn`)
   - `COHERE_API_KEY`: Your Cohere API key

## Configuration After Deployment

### 1. Get Backend URL
After deploying the backend to Render, you'll have a URL like:
`https://your-app-name.onrender.com`

### 2. Update Frontend Environment Variables
- Go to your Vercel project settings
- Update `NEXT_PUBLIC_WEBSOCKET_URL` to use `wss://` protocol:
  - From: `https://your-app-name.onrender.com`
  - To: `wss://your-app-name.onrender.com`

### 3. Redeploy Frontend
- Trigger a new deployment on Vercel to pick up the environment changes

## Important Notes

### WebSocket Protocol
- When connecting from Vercel frontend to Render backend, use `wss://` (secure WebSocket)
- During local development, use `ws://` (insecure WebSocket) with `ws://localhost:8001`

### Environment Variables
- Never expose backend API keys in frontend code
- Backend environment variables (like API keys) should only be set on the backend deployment
- Frontend only needs the WebSocket URL

### Qdrant Database
- Your Qdrant instance must be accessible from the internet
- If using a local Qdrant instance, it won't be accessible to cloud deployments
- Consider using Qdrant Cloud or hosting Qdrant on a publicly accessible server

## Troubleshooting

### Frontend Can't Connect to Backend
- Verify the WebSocket URL is correct in Vercel environment variables
- Ensure you're using `wss://` for production deployments
- Check that the backend is running and accessible

### Backend Deployment Fails
- Verify all required environment variables are set
- Check that the Python runtime is correctly specified
- Ensure dependencies in requirements.txt are compatible

### RAG Functionality Not Working
- Verify Qdrant connection details are correct
- Ensure the collection exists and has been populated with data
- Check Cohere API key is valid and has sufficient quota

## Scaling Considerations

### Frontend
- Vercel automatically handles scaling for static content
- No additional configuration needed

### Backend
- Render provides basic scaling options
- For high-traffic applications, consider a more robust hosting solution
- Monitor resource usage and scale accordingly
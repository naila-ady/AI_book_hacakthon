# Deployment Skill

## Purpose
Complete end-to-end deployment of AI Robotics Book Chatbot application from scratch: clone Hugging Face Space repository, transfer backend code, fix module import issues, update frontend to use Hugging Face backend URL, configure environment variables on both platforms, and ensure proper authentication flow between Vercel frontend and Hugging Face backend.

## Implementation Steps

### 1. **Initial Assessment**
   - Check current deployment status and identify issues
   - Verify backend is running on Hugging Face Spaces
   - Identify authentication and environment variable issues
   - Locate all files using localhost references
   - Review deployment summary for comprehensive issue tracking

### 2. **Backend Setup on Hugging Face Spaces**
   - Clone the Hugging Face Space repository:
     `git clone https://huggingface.co/spaces/username/space-name`
   - Example: `git clone https://huggingface.co/spaces/nkamdar/ai_book_hackathon`
   - Copy backend code from `backend/chatbot-backend/` to the Space directory:
     - Copy entire `app/` directory
     - Copy `requirements.txt`
     - Copy `run_app.py` (created for proper Python path handling)
     - Copy `Dockerfile` (properly configured for Hugging Face Spaces)
   - Create proper Dockerfile for FastAPI application:
     ```dockerfile
     FROM python:3.11-slim

     # Set environment variables
     ENV PYTHONDONTWRITEBYTECODE=1
     ENV PYTHONUNBUFFERED=1

     # Install system dependencies
     RUN apt-get update && \
         apt-get install -y --no-install-recommends \
             build-essential \
             curl \
             gnupg \
             libpq-dev \
             gcc \
             postgresql-client && \
         rm -rf /var/lib/apt/lists/*

     # Set working directory
     WORKDIR /app

     # Copy requirements first for better caching
     COPY requirements.txt .
     RUN pip install --upgrade pip && \
         pip install --no-cache-dir -r requirements.txt

     # Copy the application files
     COPY ./app ./app
     COPY . .

     # Expose the port Hugging Face Spaces uses
     EXPOSE 7860

     # Run the application
     CMD ["python", "run_app.py"]
     ```
   - Add `__init__.py` to make app directory a Python package:
     - Create empty file `app/__init__.py` to make Python recognize it as a package
     - This fixes "No module named 'app.main'; 'app' is not a package" error
   - Update `run_app.py` for proper Python path handling:
     ```python
     import os
     import sys
     from pathlib import Path

     # Add the current directory to Python path
     sys.path.insert(0, str(Path(__file__).parent))

     # Set environment variables to ensure proper configuration loading
     os.environ.setdefault('COHERE_API_KEY', os.getenv('COHERE_API_KEY', ''))
     os.environ.setdefault('QDRANT_URL', os.getenv('QDRANT_URL', ''))
     os.environ.setdefault('QDRANT_API_KEY', os.getenv('QDRANT_API_KEY', ''))
     os.environ.setdefault('QDRANT_COLLECTION', os.getenv('QDRANT_COLLECTION', 'bookn'))

     import uvicorn
     from app.main import app

     if __name__ == "__main__":
         port = int(os.environ.get("PORT", 7860))
         uvicorn.run(app, host="0.0.0.0", port=port)
     ```

### 3. **Backend Environment Configuration**
   - Set environment variables in Hugging Face Spaces dashboard:
     - `COHERE_API_KEY`: Cohere API key
     - `QDRANT_URL`: Qdrant database URL
     - `QDRANT_API_KEY`: Qdrant API key
     - `QDRANT_COLLECTION`: Collection name (default: bookn)
     - `JWT_SECRET_KEY`: JWT secret for authentication
     - `DATABASE_URL`: PostgreSQL connection string (for NeonDB or other DB)

### 4. **Frontend Code Updates**
   - Update all authentication files to use hardcoded backend URL instead of process.env:
     - `frontend/src/config/auth.config.js`:
       ```javascript
       // Replace: const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
       // With: const apiUrl = 'https://nkamdar-ai-book-hackathon.hf.space'; // Replace with your Hugging Face Space URL
       ```
     - `frontend/src/contexts/AuthContext.js`:
       ```javascript
       // Replace: const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
       // With: const apiUrl = 'https://nkamdar-ai-book-hackathon.hf.space'; // Replace with your Hugging Face Space URL
       ```
     - `frontend/src/pages/dashboard.js`:
       ```javascript
       // Replace: const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
       // With: const apiUrl = 'https://nkamdar-ai-book-hackathon.hf.space'; // Replace with your Hugging Face Space URL
       ```
   - Fix Authorization header handling:
     - Replace: `'Authorization': 'Bearer ' + token`
     - With: `'Authorization': token ? 'Bearer ' + token : ''`
   - Update Chatbot component if needed:
     - `frontend/src/components/Chatbot/index.tsx` - Ensure backend URL is properly configured
   - Update Docusaurus configuration for Vercel deployment:
     - Change `baseUrl` from `/AI_book_hacakthon/` to `/`
     - Update URL configuration from GitHub Pages to Vercel format
     - Fix environment variable access to avoid "process is not defined" error

### 5. **Frontend Environment Configuration on Vercel**
   - Go to Vercel dashboard for your project
   - Navigate to Settings → Environment Variables
   - Add/update the variable:
     - Key: `NEXT_PUBLIC_API_URL`
     - Value: `https://your-hf-space-name.hf.space` (e.g., `https://nkamdar-ai-book-hackathon.hf.space`)
   - For Better Auth specifically, also set:
     - Key: `NEXT_PUBLIC_BETTER_AUTH_URL`
     - Value: `https://your-hf-space-name.hf.space`

### 6. **File Structure**
   - Backend directory structure:
     ```
     ai_book_hackathon/ (cloned Hugging Face Space)
     ├── app/
     │   ├── __init__.py
     │   ├── main.py
     │   ├── config.py
     │   ├── dependencies.py
     │   ├── api/
     │   │   ├── __init__.py
     │   │   ├── auth.py
     │   │   └── chatbot.py
     │   ├── services/
     │   │   └── rag_service.py
     │   └── utils/
     ├── Dockerfile
     ├── requirements.txt
     ├── run_app.py
     └── .env
     ```
   - Frontend directory structure:
     ```
     frontend/
     ├── src/
     │   ├── config/
     │   │   └── auth.config.js
     │   ├── contexts/
     │   │   └── AuthContext.js
     │   ├── pages/
     │   │   └── dashboard.js
     │   └── components/
     │       └── Chatbot/
     │           └── index.tsx
     ├── docusaurus.config.ts
     ├── vercel.json
     └── .env.production
     ```

### 7. **CORS Configuration for Backend**
   - Ensure CORS middleware in FastAPI allows Vercel domain:
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # For development, restrict to Vercel domain in production
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### 8. **Authentication API Endpoints**
   - Ensure backend has proper auth endpoints:
     - POST `/api/auth/sign-in/email`
     - POST `/api/auth/sign-up/email`
     - POST `/api/auth/session`
     - POST `/api/auth/sign-out`
   - Verify endpoints are registered in `app/main.py` with the correct router prefix

## Common Deployment Issues and Fixes

1. **"process is not defined" error**:
   - Cause: Using `process.env` in browser JavaScript
   - Fix: Use hardcoded URLs in production code instead of environment variables
   - Apply to all auth.config.js, AuthContext.js, and dashboard.js files

2. **"No module named 'app.main'; 'app' is not a package" error**:
   - Cause: Missing `__init__.py` file in app directory
   - Fix: Create empty `app/__init__.py` file to make Python recognize it as a package

3. **CORS errors**:
   - Cause: Backend doesn't allow requests from frontend domain
   - Fix: Configure proper CORS settings in backend to allow Vercel domain

4. **API calls going to localhost**:
   - Cause: Environment variables not properly configured or process.env used in browser
   - Fix: Use hardcoded URLs in browser code or properly configure Vercel environment variables

5. **Module import errors in Docker**:
   - Cause: Missing __init__.py files or incorrect Python paths
   - Fix: Add __init__.py to make directories proper Python packages and update Python path

6. **Authorization header errors**:
   - Cause: Improper token handling in Authorization header
   - Fix: Use conditional assignment: `'Authorization': token ? 'Bearer ' + token : ''`

7. **WebSocket vs HTTP API confusion**:
   - Original setup used WebSocket for chat functionality
   - Updated setup uses HTTP REST API for auth functionality
   - Ensure frontend connects to correct endpoints

8. **Frontend/Backend Communication**:
   - Originally WebSocket-based (ws:// or wss://)
   - Now HTTP-based REST API calls (POST, GET methods)
   - Update frontend to use correct API endpoints

9. **"pip: not found" error in Docker**:
   - Cause: Improper Dockerfile configuration for system dependencies
   - Fix: Create proper Dockerfile with system dependencies installation

10. **Environment variable access in browser**:
   - Cause: "process is not defined" error in browser JavaScript
   - Fix: Use proper environment variable access for browser compatibility

## Environment Variables Setup

### For Vercel:
- `NEXT_PUBLIC_API_URL`: Backend URL (e.g., https://your-hf-space.hf.space)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Same backend URL for Better Auth

### For Hugging Face Spaces:
- `COHERE_API_KEY`: Cohere API key
- `QDRANT_URL`: Qdrant database URL
- `QDRANT_API_KEY`: Qdrant API key
- `QDRANT_COLLECTION`: Collection name (default: bookn)
- `JWT_SECRET_KEY`: JWT secret for authentication
- `DATABASE_URL`: Database connection string (PostgreSQL like NeonDB)

## Key Files Modified
- `Dockerfile` (root): Fixed for Hugging Face Spaces deployment
- `frontend/docusaurus.config.ts`: Updated for Vercel deployment
- `frontend/vercel.json`: Fixed build configuration
- `frontend/src/components/Chatbot/index.tsx`: Fixed backend connection and environment variables
- `frontend/.env`: Added backend URL configuration
- `frontend/src/config/auth.config.js` - API URL configuration
- `frontend/src/contexts/AuthContext.js` - Session validation
- `frontend/src/pages/dashboard.js` - Session checking
- `backend/chatbot-backend/app/__init__.py` - Make app directory a package
- `backend/chatbot-backend/Dockerfile` - Proper Python package setup
- `backend/chatbot-backend/run_app.py` - Python path handling

## Deployment Commands
1. **Backend (Hugging Face Spaces)**:
   ```bash
   cd ai_book_hackathon
   git add .
   git commit -m "Update backend with proper module imports and deployment fixes"
   git push origin main
   ```

2. **Frontend (Vercel)**:
   - Push changes to GitHub repository
   - Vercel automatically deploys when connected to GitHub

## Final Configuration
- Backend: https://nkamdar-ai-book-hackathon.hf.space
- Frontend: Deployed via Vercel
- API Communication: Frontend connects to backend via HTTPS
- Environment Variables: Properly handled for browser environment

## Testing Checklist
1. Verify backend is accessible at Hugging Face Space URL
2. Test health endpoint: `https://your-space.hf.space/health`
3. Test auth endpoints: `https://your-space.hf.space/api/auth/sign-in/email`
4. Verify frontend can connect to backend
5. Test login functionality end-to-end
6. Check CORS headers are properly set
7. Verify authentication tokens are properly stored and used
8. Test cross-domain communication between Vercel frontend and Hugging Face backend
9. Verify all API calls go to Hugging Face backend instead of localhost
10. Test signup, login, session check, and logout functionality
11. Confirm no "process is not defined" errors occur
12. Verify chatbot functionality works with backend API
13. Check that proper connectivity exists between frontend and backend
14. Ensure environment variables are properly handled in browser
15. Verify both query and health check endpoints work with deployed backend
# Railway and Vercel Deployment Agent

## Agent Purpose
This agent guides users through the process of deploying a FastAPI backend on Railway and a Docusaurus frontend on Vercel, based on the successful deployment pattern used for the AI Robotics Book Chatbot.

## Deployment Process Overview

### 1. Pre-Deployment Preparation
- Ensure your project has separate frontend and backend directories
- Verify all API endpoints are properly configured
- Prepare environment variables for both frontend and backend
- Test the application locally before deployment

### 2. Backend Deployment to Railway

#### Step 1: Create Dockerfile for Backend
```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl gnupg libpq-dev gcc postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Change to the backend directory
WORKDIR /app/backend/chatbot-backend

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Create a startup script
RUN echo '#!/bin/bash\nexec uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}' > /start.sh
RUN chmod +x /start.sh

# Run the application
CMD ["/start.sh"]
```

#### Step 2: Configure Railway Settings
- Set Builder to "Dockerfile"
- Set Root Directory to "."
- Set Dockerfile Path to "Dockerfile"
- Remove any custom build/start commands
- Add environment variables:
  - QDRANT_URL
  - QDRANT_API_KEY
  - COHERE_API_KEY
  - QDRANT_COLLECTION

#### Step 3: Deploy Backend
1. Push your code to GitHub
2. Connect Railway to your repository
3. Trigger a new deployment
4. Wait for successful build and deployment

### 3. Frontend Deployment to Vercel

#### Step 1: Update Docusaurus Configuration
```typescript
// docusaurus.config.ts
const config = {
  url: 'https://your-project-name.vercel.app', // Replace with your Vercel URL
  baseUrl: '/', // For Vercel deployment
  // ... rest of config
};
```

#### Step 2: Update Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ]
}
```

#### Step 3: Update Frontend Component for Environment Variables
```typescript
// In your frontend component
let backendUrl;
if (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  backendUrl = 'http://127.0.0.1:8000'; // Local development
} else {
  // For production deployment, use your Railway backend URL
  const envBackendUrl = typeof window !== 'undefined'
    ? (window as any).env?.REACT_APP_BACKEND_URL ||
      (window as any).env?.NEXT_PUBLIC_BACKEND_URL
    : undefined;
  backendUrl = envBackendUrl || 'https://your-railway-app.up.railway.app';
}
```

#### Step 4: Configure Vercel Settings
- Set Build Command: `npm run build`
- Set Output Directory: `build`
- Add Environment Variables:
  - NEXT_PUBLIC_BACKEND_URL (set to your Railway backend URL)

### 4. Post-Deployment Verification

#### Step 1: Test Backend API
- Visit `https://your-railway-app.up.railway.app/health`
- Verify all API endpoints are accessible
- Test API functionality

#### Step 2: Test Frontend
- Visit your Vercel deployment URL
- Verify the frontend loads without errors
- Check browser console for any issues

#### Step 3: Test Integration
- Test the connection between frontend and backend
- Verify API calls work properly
- Ensure all functionality is working as expected

## Common Issues and Solutions

### Issue 1: "pip: not found" on Railway
**Solution**: Ensure your Dockerfile properly installs system dependencies before trying to install Python packages.

### Issue 2: "process is not defined" in Docusaurus
**Solution**: Use browser-safe environment variable access patterns in your frontend code.

### Issue 3: Frontend can't connect to backend
**Solution**:
- Verify CORS settings in your backend
- Check that environment variables are properly set
- Ensure backend URL is correctly configured

### Issue 4: Docusaurus not loading properly on Vercel
**Solution**:
- Check baseUrl configuration in docusaurus.config.ts
- Ensure it's set to '/' for Vercel deployment
- Verify vercel.json routes are properly configured

## Environment Variables Reference

### Backend (Railway)
- `QDRANT_URL` - URL for Qdrant vector database
- `QDRANT_API_KEY` - API key for Qdrant authentication
- `COHERE_API_KEY` - API key for Cohere service
- `QDRANT_COLLECTION` - Name of the Qdrant collection
- `PORT` - Port number (provided by Railway)

### Frontend (Vercel)
- `NEXT_PUBLIC_BACKEND_URL` - URL of your deployed backend

## Success Checklist
- [ ] Backend successfully deployed on Railway
- [ ] Frontend successfully deployed on Vercel
- [ ] Health check endpoint accessible
- [ ] API endpoints working properly
- [ ] Frontend connects to backend without errors
- [ ] All application functionality working
- [ ] Environment variables properly configured
- [ ] CORS issues resolved
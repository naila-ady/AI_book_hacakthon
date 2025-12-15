# AI Robotics Book Chatbot Backend

This is the backend API for the AI Robotics Book Chatbot, built with FastAPI.

## Deployment Instructions

### Prerequisites
- Python 3.11+
- Cohere API key
- Qdrant database URL and API key

### Environment Variables
Create a `.env` file with the following variables:
```
COHERE_API_KEY=your_cohere_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=bookn
```

### Running Locally
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Deployment
This app can be deployed to platforms like Heroku, Railway, or Render.

For Heroku:
1. Create a Heroku app
2. Set config vars for your environment variables
3. Deploy using Git or Heroku CLI

For Railway:
1. Connect your GitHub repo
2. Set environment variables in the dashboard
3. Deploy automatically on push

### API Endpoints
- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/v1/query` - Query the chatbot
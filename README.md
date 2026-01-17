# AI Robotics Book Chatbot

An AI-powered chatbot application designed to answer questions about robotics books using Retrieval-Augmented Generation (RAG) technology. The application combines a Docusaurus frontend with a FastAPI backend to provide an interactive chat experience.

## 🚀 Features

- Interactive chat interface for querying robotics book content
- RAG (Retrieval-Augmented Generation) technology for accurate responses
- Real-time WebSocket communication
- Integration with Cohere for natural language processing
- Vector database storage using Qdrant for semantic search
- Authentication system for user management
- Responsive web interface built with React

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern, fast web framework for building APIs
- **websockets** - WebSocket protocol implementation
- **Cohere** - Natural language processing API
- **Qdrant** - Vector database for semantic search
- **PostgreSQL** - Database for user management

### Frontend
- **Docusaurus** - Static site generator based on React
- **TypeScript** - Type-safe JavaScript development
- **Better Auth** - Authentication library

## 📁 Project Structure

```
AI_book_hacakthon/
├── backend/
│   └── chatbot-backend/
│       ├── app/
│       │   ├── api/           # API route definitions
│       │   ├── services/      # Business logic and RAG implementation
│       │   ├── utils/         # Utility functions
│       │   └── main.py        # FastAPI application entry point
│       ├── chat_server.py     # WebSocket server implementation
│       ├── requirements.txt   # Python dependencies
│       └── .env               # Environment variables
├── frontend/
│   ├── src/                  # Docusaurus source files
│   ├── static/               # Static assets
│   ├── package.json          # Node.js dependencies
│   ├── docusaurus.config.ts  # Docusaurus configuration
│   └── .env.local            # Frontend environment variables
├── Dockerfile               # Containerization configuration
└── README.md               # This file
```

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.11 or higher)
- **pip** (Python package manager)
- **npm** or **yarn** (Node.js package managers)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/chatbot-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables by creating a `.env` file:
   ```env
   COHERE_API_KEY=your_cohere_api_key
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   QDRANT_COLLECTION=bookn
   DATABASE_URL=your_database_url
   SECRET_KEY=your_secret_key
   ```

5. Run the backend server:
   ```bash
   # For WebSocket server (chat functionality):
   python chat_server.py

   # Or for REST API:
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend/chatbot-backend
   python chat_server.py
   # or
   uvicorn app.main:app --reload
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   # or
   yarn start
   ```

3. Open your browser to `http://localhost:3000` to access the application

### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the backend with a production-ready server:
   ```bash
   cd backend/chatbot-backend
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## 🌐 API Endpoints

### Backend (FastAPI)
- `GET /` - Root endpoint (welcome message)
- `GET /health` - Health check
- `GET /qdrant-test` - Test Qdrant connection
- `POST /api/v1/query` - Query the chatbot
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

### WebSocket (Real-time chat)
- `ws://localhost:8001` - WebSocket endpoint for real-time chat

## 🚢 Deployment

### Backend Deployment (Railway)
The backend is configured for deployment on Railway:
1. Connect your GitHub repository to Railway
2. Set environment variables in the Railway dashboard
3. Deploy automatically on push

### Frontend Deployment (Vercel)
The frontend is configured for deployment on Vercel:
1. Connect your GitHub repository to Vercel
2. Set build command to `npm run build`
3. Set output directory to `build`

## 🔐 Environment Variables

### Backend (.env)
```env
COHERE_API_KEY=your_cohere_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=bookn
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
PORT=8000
```

### Frontend (.env.local)
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

## 🤖 How It Works

The AI Robotics Book Chatbot uses a Retrieval-Augmented Generation (RAG) approach:

1. **Data Storage**: Robotics book content is stored in a Qdrant vector database
2. **Query Processing**: When a user asks a question, the system retrieves relevant documents
3. **Response Generation**: Cohere API generates contextually relevant answers
4. **Real-time Interaction**: WebSocket connections enable real-time chat experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository or contact the maintainers.

print("---- Loading main.py ----")
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import Config
from app.services.rag_service import RAGService
from app.api import chatbot as chatbot_api
from app.api import auth as auth_api
from app.dependencies import get_rag_service

# --- FastAPI App Initialization ---
app = FastAPI(title="AI Robotics Book Chatbot API")

# Add CORS middleware to allow requests from frontend
# For production, replace ["*"] with specific frontend URLs like ["https://yourdomain.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Replace with your actual frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
app.include_router(chatbot_api.router, prefix="/api/v1", tags=["chatbot"])
app.include_router(auth_api.router, prefix="/api", tags=["auth"])

# --- Core Routes ---
@app.get("/", summary="Root endpoint", tags=["default"])
def read_root():
    """Returns a welcome message."""
    return {"message": "Welcome to the AI Robotics Book Chatbot API"}

@app.get("/health", summary="Health Check", tags=["default"])
def health_check():
    """Provides a basic health status of the API."""
    return {"status": "ok", "message": "FastAPI backend is healthy"}

@app.get("/qdrant-test", summary="Test Qdrant Connection", tags=["testing"])
def qdrant_test(rag_service: RAGService = Depends(get_rag_service)):
    """
    Tests the connection to Qdrant and lists available collections.
    This endpoint relies on the RAGService, so it also implicitly tests
    the service's initialization.
    """
    if not rag_service:
        raise HTTPException(status_code=503, detail="RAGService not initialized")
    try:
        collections = rag_service.qdrant_client.get_collections()
        collection_names = [c.name for c in collections.collections]
        return {
            "status": "success",
            "qdrant_url": Config.QDRANT_URL,
            "active_collection": rag_service.collection_name,
            "available_collections": collection_names
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to Qdrant: {str(e)}")

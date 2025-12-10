
from functools import lru_cache
from app.config import Config
from app.services.rag_service import RAGService

@lru_cache()
def get_rag_service() -> RAGService:
    """
    Dependency injector for the RAGService.
    Using lru_cache ensures the service is a singleton for the app's lifecycle.
    """
    try:
        service = RAGService()
        service.initialize_collection()
        print("RAGService initialized successfully.")
        return service
    except Exception as e:
        print(f"FATAL: RAGService failed to initialize: {e}")
        # In a production scenario, you might want to handle this more gracefully
        # or prevent the app from starting entirely if the RAG service is critical.
        raise RuntimeError(f"RAGService could not be initialized: {e}") from e

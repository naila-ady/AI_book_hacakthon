# from fastapi import FastAPI
# from pydantic import BaseModel
# from .services.rag_service import RAGService

# app = FastAPI()

# rag_service = RAGService()

# class ChatRequest(BaseModel):
#     question: str
#     selected_text: str | None = None

# @app.get("/")
# async def root():
#     return {"message": "Chatbot Backend Running"}

# @app.get("/health")
# async def health_check():
#     return {"status": "ok"}

# @app.post("/chat")
# async def chat_with_rag(request: ChatRequest):
#     retrieved_chunks = rag_service.retrieve_chunks(request.question, request.selected_text)
#     answer = rag_service.generate_answer(request.question, retrieved_chunks)
#     return {"answer": answer, "chunks": retrieved_chunks}
# from fastapi import FastAPI
# from app.services.rag_service import RAGService

# app = FastAPI()
# rag_service = RAGService()  # safely initializes collection

# @app.get("/")
# def root():
#     return {"message": "Backend is running!"}

# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def read_root():
#     return {"message": "Hello World"}


# app/main.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.config import Config
from app.services.rag_service import RAGService

app = FastAPI()
rag_service: RAGService | None = None

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.on_event("startup")
def startup_event():
    global rag_service
    # Initialize RAGService after FastAPI is up - failures here won't prevent import
    try:
        rag_service = RAGService()
        # Try to initialize collection (safe, idempotent)
        rag_service.initialize_collection()
        if Config.DEBUG:
            print("RAGService initialized successfully.")
    except Exception as e:
        # Log the failure but don't prevent the app from starting
        print("Warning: RAGService failed to initialize on startup:", e)
        rag_service = None

@app.get("/qdrant-test")
def qdrant_test():
    """
    Quick test endpoint to check Qdrant status from inside the running app.
    """
    if rag_service is None:
        return JSONResponse(status_code=503, content={"status":"error","details":"RAGService not initialized"})
    try:
        collections = rag_service.list_collections()
        return {"status": "success", "collections": collections}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status":"error","details": str(e)})


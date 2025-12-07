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

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}


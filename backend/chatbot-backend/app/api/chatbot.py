
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services.rag_service import RAGService
from app.dependencies import get_rag_service

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    selected_text: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]

@router.post("/query", response_model=QueryResponse)
async def query_chatbot(request: QueryRequest):
    """
    Receives a user's query.
    This endpoint now includes a manual dependency check to expose initialization errors.
    """
    try:
        # Manually resolve the dependency to catch initialization errors
        rag_service = get_rag_service()
    except Exception as e:
        error_message = f"Failed to initialize RAGService. Please check your .env file and server logs. Error: {e}"
        print(error_message)
        # Return the error in the response for debugging
        return QueryResponse(answer=error_message, sources=[])

    # If the service is initialized, proceed with the query
    try:
        result = rag_service.query(
            query=request.query,
            selected_text=request.selected_text
        )
        return QueryResponse(
            answer=result.get("answer", "No answer found."),
            sources=result.get("sources", [])
        )
    except Exception as e:
        # This will catch errors during the query itself
        error_message = f"An error occurred while processing your query: {e}"
        print(error_message)
        raise HTTPException(status_code=500, detail=error_message)


import cohere as cohere_module
from qdrant_client import QdrantClient, models
from qdrant_client.models import VectorParams, Distance, ScoredPoint
from typing import List, Optional, Dict, Any, Tuple

from app.config import Config

class RAGService:
    def __init__(self):
        if not Config.QDRANT_URL or not Config.COHERE_API_KEY:
            raise ValueError("QDRANT_URL and COHERE_API_KEY must be set in environment.")
        
        self.qdrant_client = QdrantClient(url=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY)
        self.cohere_client = cohere_module.Client(api_key=Config.COHERE_API_KEY)
        self.collection_name = Config.QDRANT_COLLECTION or "book_content"

    def initialize_collection(self):
        try:
            self.qdrant_client.get_collection(collection_name=self.collection_name)
        except Exception:
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
            )
            print(f"Created collection '{self.collection_name}'.")

    def get_embedding(self, text: str, input_type: str) -> List[float]:
        response = self.cohere_client.embed(
            texts=[text],
            model="embed-english-v3.0",
            input_type=input_type
        )
        return response.embeddings[0]

    def search_and_retrieve_chunks(self, query: str, selected_text: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        search_query = f"{selected_text}\n\n{query}" if selected_text else query
        query_embedding = self.get_embedding(search_query, "search_query")
        
        search_results = self.qdrant_client.query_points(
            collection_name=self.collection_name,
            query=query_embedding,
            limit=top_k,
            with_payload=True
        )
        return [hit.payload for hit in search_results.points if hit.payload]

    def generate_answer(self, question: str, context_chunks: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
        if not context_chunks:
            return "I don't have enough information to answer that question based on the book's content.", []

        documents = [
            {
                "title": chunk.get("title", "Unknown Title"),
                "snippet": chunk.get("content", ""),
                "source": chunk.get("source", "Unknown Source")
            } for chunk in context_chunks
        ]
        
        response = self.cohere_client.chat(
            message=question,
            documents=documents,
            preamble="You are a helpful assistant for the 'Physical AI and Humanoid Robotics' book. Answer questions based only on the provided document snippets. Cite the source file for your answer."
        )
        
        return response.text, response.documents or []

    def query(self, query: str, selected_text: Optional[str] = None) -> Dict[str, Any]:
        retrieved_chunks = self.search_and_retrieve_chunks(query, selected_text)
        answer, cited_documents = self.generate_answer(query, retrieved_chunks)
        
        sources = [doc['source'] for doc in cited_documents if 'source' in doc]
        
        return {
            "answer": answer,
            "sources": list(set(sources)) # Return unique source files
        }

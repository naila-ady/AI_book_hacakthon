# from qdrant_client import QdrantClient
# import cohere
# from qdrant_client.http.models import Distance, VectorParams
# from qdrant_client.models import PointStruct

# from ..config import Config

# class RAGService:
#     def __init__(self):
#         self.qdrant_client = QdrantClient(host=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY)
#         self.cohere_client = cohere.Client(api_key=Config.COHERE_API_KEY)
#         self.collection_name = "book_content"
#         self._initialize_qdrant_collection()

#     def _initialize_qdrant_collection(self):
#         try:
#             self.qdrant_client.get_collection(collection_name=self.collection_name)
#         except Exception: # Collection does not exist, create it
#             self.qdrant_client.create_collection(
#                 collection_name=self.collection_name,
#                 vectors_config=VectorParams(size=1024, distance=Distance.COSINE), # Cohere embeddings size
#             )

#     def get_embedding(self, text: str) -> list[float]:
#         """
#         Generates an embedding for the given text using Cohere.
#         """
#         response = self.cohere_client.embed(
#             texts=[text],
#             model="embed-english-v3.0",
#             input_type="search_document"
#         )
#         return response.embeddings[0]

#     def retrieve_chunks(self, query: str, selected_text: str = None, top_k: int = 5) -> list[str]:
#         """
#         Retrieves relevant chunks from Qdrant based on the query and optional selected text.
#         """
#         search_query = query
#         if selected_text:
#             # Combine selected text with query for better context
#             search_query = f"{selected_text}\n\n{query}"

#         query_embedding = self.get_embedding(search_query)

#         search_result = self.qdrant_client.search(
#             collection_name=self.collection_name,
#             query_vector=query_embedding,
#             limit=top_k,
#             append_payload=True # We want to get the content back
#         )

#         chunks = [hit.payload["content"] for hit in search_result if "content" in hit.payload]
#         return chunks

#     def generate_answer(self, question: str, context: list[str]) -> str:
#         """
#         Generates an answer to the question based on the provided context using Cohere's chat completion.
#         """
#         context_str = "\n\n".join(context)
#         if not context_str:
#             return "I don't have enough information in the book content to answer that."

#         message = f"Context: {context_str}\n\nQuestion: {question}"

#         response = self.cohere_client.chat(
#             message=message,
#             preamble="You are a helpful assistant that answers questions based on the provided book content. If the answer is not in the context, politely state that you don't have enough information."
#         )
#         return response.text
# app/services/rag_service.py
from qdrant_client import QdrantClient
import cohere
from qdrant_client.models import VectorParams, Distance
from qdrant_client.http.models import PointStruct  # for upsert in some qdrant versions
from app.config import Config
from typing import List, Optional

class RAGService:
    def __init__(self):
        """
        Construct clients but do not require a successful network call at import time.
        Use initialize_collection() to create/check the collection (call during startup).
        """
        # Use `url=` for Qdrant Cloud (not host=)
        if not Config.QDRANT_URL:
            raise ValueError("QDRANT_URL is not set in environment")
        self.qdrant_client = QdrantClient(url=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY or None)
        if not Config.COHERE_API_KEY:
            # we allow missing cohere for safe testing, but many features require it
            print("Warning: COHERE_API_KEY not set; embedding/answer generation will fail.")
        self.cohere_client = cohere.Client(api_key=Config.COHERE_API_KEY) if Config.COHERE_API_KEY else None
        self.collection_name = Config.QDRANT_COLLECTION or "book_content"

    # -------------------
    # Collection helpers
    # -------------------
    def initialize_collection(self):
        """
        Ensure the collection exists. Safe to call multiple times.
        """
        try:
            # If get_collection works, collection exists
            self.qdrant_client.get_collection(collection_name=self.collection_name)
            # print(f"Collection '{self.collection_name}' exists.")
        except Exception:
            # create collection with appropriate vector size/distance
            try:
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
                )
                print(f"Created collection '{self.collection_name}'.")
            except Exception as e:
                # raise so caller can decide how to handle it
                raise RuntimeError(f"Failed to create collection '{self.collection_name}': {e}") from e

    def list_collections(self) -> List[str]:
        info = self.qdrant_client.get_collections()
        return [c.name for c in info.collections]

    # -------------------
    # Embedding helpers
    # -------------------
    def get_embedding(self, text: str) -> List[float]:
        if not self.cohere_client:
            raise RuntimeError("Cohere client not configured (COHERE_API_KEY missing)")
        response = self.cohere_client.embed(
            texts=[text],
            model="embed-english-v3.0",
            input_type="search_document"
        )
        # .embeddings is usually present
        return response.embeddings[0]

    # -------------------
    # Retrieval & generation
    # -------------------
    def retrieve_chunks(self, query: str, selected_text: Optional[str] = None, top_k: int = 5) -> List[str]:
        if selected_text:
            search_query = f"{selected_text}\n\n{query}"
        else:
            search_query = query

        query_embedding = self.get_embedding(search_query)
        search_result = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        chunks = []
        for hit in search_result:
            payload = getattr(hit, "payload", None) or {}
            if "content" in payload:
                chunks.append(payload["content"])
        return chunks

    def generate_answer(self, question: str, context: List[str]) -> str:
        if not self.cohere_client:
            raise RuntimeError("Cohere client not configured (COHERE_API_KEY missing)")
        context_str = "\n\n".join(context)
        if not context_str:
            return "I don't have enough information in the book content to answer that."

        message = f"Context: {context_str}\n\nQuestion: {question}"
        response = self.cohere_client.chat(
            message=message,
            preamble="You are a helpful assistant that answers questions based on the provided book content. If the answer is not in the context, politely state that you don't have enough information."
        )
        return response.text

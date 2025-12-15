
# # import cohere as cohere_module
# # from qdrant_client import QdrantClient, models
# # from qdrant_client.models import VectorParams, Distance, ScoredPoint
# # from typing import List, Optional, Dict, Any, Tuple

# # from app.config import Config

# # class RAGService:
# #     def __init__(self):
# #         if not Config.QDRANT_URL or not Config.COHERE_API_KEY:
# #             raise ValueError("QDRANT_URL and COHERE_API_KEY must be set in environment.")
        
# #         self.qdrant_client = QdrantClient(url=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY)
# #         self.cohere_client = cohere_module.Client(api_key=Config.COHERE_API_KEY)
# #         self.collection_name = Config.QDRANT_COLLECTION or "book_content"

# #     def initialize_collection(self):
# #         try:
# #             self.qdrant_client.get_collection(collection_name=self.collection_name)
# #         except Exception:
# #             self.qdrant_client.create_collection(
# #                 collection_name=self.collection_name,
# #                 vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
# #             )
# #             print(f"Created collection '{self.collection_name}'.")

# #     def get_embedding(self, text: str, input_type: str) -> List[float]:
# #         response = self.cohere_client.embed(
# #             texts=[text],
# #             model="embed-english-v3.0",
# #             input_type=input_type
# #         )
# #         return response.embeddings[0]

# #     def search_and_retrieve_chunks(self, query: str, selected_text: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
# #         search_query = f"{selected_text}\n\n{query}" if selected_text else query
# #         query_embedding = self.get_embedding(search_query, "search_query")
        
# #         search_results = self.qdrant_client.query_points(
# #             collection_name=self.collection_name,
# #             query=query_embedding,
# #             limit=top_k,
# #             with_payload=True
# #         )
# #         return [hit.payload for hit in search_results.points if hit.payload]

# #     def generate_answer(self, question: str, context_chunks: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
# #         if not context_chunks:
# #             return "I don't have enough information to answer that question based on the book's content.", []

# #         documents = [
# #             {
# #                 "title": chunk.get("title", "Unknown Title"),
# #                 "snippet": chunk.get("content", ""),
# #                 "source": chunk.get("source", "Unknown Source")
# #             } for chunk in context_chunks
# #         ]
        
# #         response = self.cohere_client.chat(
# #             message=question,
# #             documents=documents,
# #             preamble="You are a helpful assistant for the 'Physical AI and Humanoid Robotics' book. Answer questions based only on the provided document snippets. Cite the source file for your answer."
# #         )
        
# #         return response.text, response.documents or []

# #     def query(self, query: str, selected_text: Optional[str] = None) -> Dict[str, Any]:
# #         retrieved_chunks = self.search_and_retrieve_chunks(query, selected_text)
# #         answer, cited_documents = self.generate_answer(query, retrieved_chunks)
        
# #         sources = [doc['source'] for doc in cited_documents if 'source' in doc]
        
# #         return {
# #             "answer": answer,
# #             "sources": list(set(sources)) # Return unique source files
# #         }
# import cohere as cohere_module
# from qdrant_client import QdrantClient
# from qdrant_client.models import VectorParams, Distance
# from typing import List, Optional, Dict, Any, Tuple
# from app.config import Config


# class RAGService:
#     def __init__(self):
#         if not Config.QDRANT_URL or not Config.COHERE_API_KEY:
#             raise ValueError("QDRANT_URL and COHERE_API_KEY must be set in environment.")

#         self.qdrant_client = QdrantClient(url=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY)
#         self.cohere_client = cohere_module.Client(api_key=Config.COHERE_API_KEY)
#         self.collection_name = Config.QDRANT_COLLECTION or "bookn"

#     def initialize_collection(self):
#         try:
#             self.qdrant_client.get_collection(collection_name=self.collection_name)
#         except Exception:
#             self.qdrant_client.create_collection(
#                 collection_name=self.collection_name,
#                 vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
#             )
#             print(f"Created collection '{self.collection_name}'.")

#     def get_embedding(self, text: str, input_type: str) -> List[float]:
#         response = self.cohere_client.embed(
#             texts=[text],
#             model="embed-english-v3.0",
#             input_type=input_type
#         )
#         return response.embeddings[0]

#     def search_and_retrieve_chunks(self, query: str, selected_text: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
#         search_query = f"{selected_text}\n\n{query}" if selected_text else query
#         query_embedding = self.get_embedding(search_query, "search_query")

#         search_results = self.qdrant_client.query_points(
#             collection_name=self.collection_name,
#             query=query_embedding,
#             limit=top_k,
#             with_payload=True
#         )
#         return [hit.payload for hit in search_results.points if hit.payload]

#     def generate_answer(self, question: str, context_chunks: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
#         if not context_chunks:
#             return "I don't have enough information to answer that question based on the book's content.", []

#         documents = [
#             {
#                 "title": chunk.get("title", "Unknown Title"),
#                 "snippet": chunk.get("content", ""),
#                 "source": chunk.get("source", "Unknown Source")
#             } for chunk in context_chunks
#         ]

#         response = self.cohere_client.chat(
#             message=question,
#             documents=documents,
#             preamble="You are a helpful assistant for the 'Physical AI and Humanoid Robotics' book. Answer questions based only on the provided document snippets. Cite the source file for your answer."
#         )

#         return response.text, response.documents or []

#     def query(self, query: str, selected_text: Optional[str] = None) -> Dict[str, Any]:
#         retrieved_chunks = self.search_and_retrieve_chunks(query, selected_text)
#         answer, cited_documents = self.generate_answer(query, retrieved_chunks)
#         sources = [doc['source'] for doc in cited_documents if 'source' in doc]
#         return {
#             "answer": answer,
#             "sources": list(set(sources))
#         }
# app/services/rag_service.py
import os
from typing import List, Dict, Any, Tuple
import cohere
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from dotenv import load_dotenv

load_dotenv()  # Load .env

class RAGService:
    def __init__(self, collection_name: str = "bookn"):
        COHERE_API_KEY = os.getenv("COHERE_API_KEY")
        QDRANT_URL = os.getenv("QDRANT_URL")
        QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

        if not COHERE_API_KEY or not QDRANT_URL:
            raise ValueError("Cohere API key and Qdrant URL must be set.")

        self.cohere_client = cohere.Client(api_key=COHERE_API_KEY)
        self.qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        self.collection_name = collection_name

    def initialize_collection(self):
        try:
            # Try to get the collection first
            self.qdrant_client.get_collection(collection_name=self.collection_name)
            print(f"Collection {self.collection_name} already exists.")
        except Exception as e:
            # If it doesn't exist, create it
            try:
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
                )
                print(f"Created collection {self.collection_name}")
            except Exception as create_error:
                # If creation fails due to collection already existing, that's fine
                if "already exists" in str(create_error):
                    print(f"Collection {self.collection_name} already exists.")
                else:
                    print(f"Error creating collection: {create_error}")
                    raise create_error

    def get_embedding(self, text: str) -> List[float]:
        resp = self.cohere_client.embed(
            texts=[text],
            model="embed-english-v3.0",
            input_type="search_document"
        )
        return resp.embeddings[0]

    def search_and_retrieve_chunks(
        self,
        query: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        query_embedding = self.get_embedding(query)
        # Use the correct method name for the Qdrant client version
        # Try the newer method first, fall back to older method if needed
        try:
            # For newer versions of qdrant-client
            results = self.qdrant_client.query_points(
                collection_name=self.collection_name,
                query=query_embedding,
                limit=top_k,
                with_payload=True
            )
            # Convert results to the expected format
            return [hit.payload for hit in results.points if hit.payload]
        except AttributeError:
            # For older versions of qdrant-client
            results = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k,
                with_payload=True
            )
            return [hit.payload for hit in results if hit.payload]

    def generate_answer(
        self,
        question: str,
        context_chunks: List[Dict[str, Any]]
    ) -> Tuple[str, List[Dict[str, Any]]]:
        if not context_chunks:
            return "I don't have enough information to answer that question.", []

        # Build the prompt manually (combine content and instructions)
        prompt = "You are a helpful assistant for the 'Physical AI and Humanoid Robotics' book.\n"
        prompt += "Answer questions using only the following book snippets. Cite the source file.\n\n"

        for chunk in context_chunks:
            content = chunk.get("content", "")
            source = chunk.get("file_path", "Unknown Source")
            prompt += f"Content from {source}:\n{content}\n\n"

        prompt += f"Question: {question}\nAnswer:"

        try:
            # Use the correct Cohere API call without specifying a deprecated model
            response = self.cohere_client.chat(
                message=prompt,
                max_tokens=500
            )
            answer = response.text.strip()
        except Exception as e:
            # Fallback response if Cohere API fails
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Cohere API error: {e}")
            answer = f"Sorry, I encountered an error processing your request: {str(e)}"

        return answer, context_chunks

    def query(self, query: str, selected_text: str = None) -> Dict[str, Any]:
        # If selected_text is provided, incorporate it into the search query
        if selected_text:
            search_query = f"{selected_text}\n\n{query}"
        else:
            search_query = query

        retrieved_chunks = self.search_and_retrieve_chunks(search_query)
        answer, cited_documents = self.generate_answer(query, retrieved_chunks)  # Use original query for answer generation
        sources = [doc.get("file_path", "Unknown") for doc in cited_documents]
        return {"answer": answer, "sources": list(set(sources))}

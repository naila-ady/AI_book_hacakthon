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
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

class RAGService:
    def __init__(self):
        self.collection_name = "my_collection"
        self.qdrant_client = QdrantClient(
            url="https://6667e5b0-723f-43f0-8abc-43e5fe6ec2b4.us-west-2-0.aws.cloud.qdrant.io",
            api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.1rerAOAivzD8yQwxYqpph_Gi6n-kOwp5AtYZVq_MSNw"
        )
        self._initialize_qdrant_collection()

    def _initialize_qdrant_collection(self):
        try:
            if self.collection_name not in [c.name for c in self.qdrant_client.get_collections().collections]:
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
                )
                print(f"Collection '{self.collection_name}' created.")
            else:
                print(f"Collection '{self.collection_name}' already exists.")
        except Exception as e:
            print("⚠️ Failed to initialize Qdrant collection:", e)

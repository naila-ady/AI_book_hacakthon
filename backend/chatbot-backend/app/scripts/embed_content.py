import os
import glob
from qdrant_client import QdrantClient, models
from openai import OpenAI

from chatbot_backend.app.config import Config
from chatbot_backend.app.utils.content_parser import parse_markdown_file, chunk_content

# Initialize clients
client_qdrant = QdrantClient(host=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY)
client_openai = OpenAI(api_key=Config.OPENAI_API_KEY)

COLLECTION_NAME = "book_content"

def get_embedding(text: str) -> list[float]:
    """
    Generates an embedding for the given text using OpenAI.
    """
    response = client_openai.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def upload_to_qdrant(chunks: list[str], metadata: dict):
    """
    Generates embeddings for chunks and uploads them to Qdrant.
    """
    points = []
    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        points.append(
            models.PointStruct(
                id=f"{metadata.get("file_path")}_{i}", # Unique ID for each chunk
                vector=embedding,
                payload={
                    "content": chunk,
                    "file_path": metadata.get("file_path"),
                    "title": metadata.get("title"),
                    **metadata, # Add all provided metadata
                },
            )
        )

    # Create collection if it doesn't exist
    # Note: In a real application, you might manage collection creation/updates more robustly
    try:
        client_qdrant.get_collection(collection_name=COLLECTION_NAME)
    except Exception:
        client_qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
        )

    client_qdrant.upsert(collection_name=COLLECTION_NAME, points=points, wait=True)
    print(f"Uploaded {len(points)} chunks to Qdrant for {metadata.get("file_path")}")

def collect_markdown_files(base_path: str) -> list[str]:
    """
    Collects all markdown files from the specified base path.
    """
    return glob.glob(os.path.join(base_path, "**/*.md"), recursive=True)

def embed_book_content():
    """
    Main function to parse book content, generate embeddings, and upload to Qdrant.
    """
    book_docs_path = "AI_huamnoid_book/docs/"
    markdown_files = collect_markdown_files(book_docs_path)

    for file_path in markdown_files:
        print(f"Processing {file_path}...")
        content = parse_markdown_file(file_path)
        chunks = chunk_content(content)

        # Extract title from file_path or frontmatter (simplified for now)
        title = os.path.basename(file_path).replace(".md", "").replace("-", " ").title()

        metadata = {"file_path": file_path, "title": title}
        upload_to_qdrant(chunks, metadata)

if __name__ == "__main__":
    embed_book_content()
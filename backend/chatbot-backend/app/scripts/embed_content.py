
import os
import glob
from qdrant_client import QdrantClient, models
import cohere
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "").strip()
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION", "book_content")

if not QDRANT_URL:
    raise RuntimeError("QDRANT_URL is not set in environment")

client_qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY or None)
client_cohere = cohere.Client(api_key=COHERE_API_KEY) if COHERE_API_KEY else None

def parse_markdown_file(file_path: str) -> str:
    if not os.path.exists(file_path):
        return ""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def chunk_content(content: str, chunk_size: int = 500, overlap: int = 50):
    if not content:
        return []
    words = content.split()
    chunks = []
    i = 0
    step = max(1, chunk_size - overlap)
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += step
    return chunks

def get_embedding(text: str):
    if not client_cohere:
        raise RuntimeError("COHERE_API_KEY not set")
    resp = client_cohere.embed(texts=[text], model="embed-english-v3.0", input_type="search_document")
    return resp.embeddings[0]

def upload_to_qdrant(chunks, metadata):
    points = []
    file_path = metadata.get("file_path", "unknown")
    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        # Use a safe id (no spaces)
        point_id = f"{os.path.basename(file_path)}_{i}"
        points.append(
            models.PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "content": chunk,
                    "file_path": file_path,
                    "title": metadata.get("title", ""),
                    **metadata,
                }
            )
        )

    # ensure collection exists
    try:
        client_qdrant.get_collection(collection_name=COLLECTION_NAME)
    except Exception:
        client_qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE),
        )

    client_qdrant.upsert(collection_name=COLLECTION_NAME, points=points, wait=True)
    print(f"Uploaded {len(points)} chunks to Qdrant for {file_path}")

def collect_markdown_files(base_path: str):
    return glob.glob(os.path.join(base_path, "**/*.md"), recursive=True)

def embed_book_content():
    base_docs = os.getenv("BOOK_DOCS_PATH", "AI_huamnoid_book/docs/")
    markdown_files = collect_markdown_files(base_docs)
    if not markdown_files:
        print("No markdown files found at", base_docs)
        return

    for file_path in markdown_files:
        print("Processing", file_path)
        content = parse_markdown_file(file_path)
        chunks = chunk_content(content)
        title = os.path.basename(file_path).replace(".md", "").replace("-", " ").title()
    

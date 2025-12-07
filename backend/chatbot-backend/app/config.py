
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env from project root (if present)

class Config:
    # Qdrant (use url for cloud, e.g. https://<cluster-id>.cloud.qdrant.io[:port_if_needed])
    QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip()
    QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "book_content").strip()

    # Cohere
    COHERE_API_KEY = os.getenv("COHERE_API_KEY", "").strip()

    # Other config
    DEBUG = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")

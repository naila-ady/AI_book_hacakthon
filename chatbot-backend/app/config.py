import os

class Config:
    QDRANT_URL = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")

    # OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

    # Neon Postgres (if applicable for metadata)
    DATABASE_URL = os.getenv("DATABASE_URL", "")
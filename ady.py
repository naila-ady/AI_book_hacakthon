from qdrant_client import QdrantClient

# Replace with your actual cluster URL and API key
QDRANT_URL = "<qdranturl>"
API_KEY ="<yourapikey>"


try:
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=API_KEY
    )
    
    # Test connection by fetching cluster info
    info = client.get_collections()
    print("✅ Connection successful!")
    print("Collections:", info)
except Exception as e:
    print("❌ Connection failed!")
    print(e)

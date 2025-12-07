from qdrant_client import QdrantClient

# Replace with your actual cluster URL and API key
QDRANT_URL = "https://6667e5b0-723f-43f0-8abc-43e5fe6ec2b4.us-west-2-0.aws.cloud.qdrant.io"
API_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.1rerAOAivzD8yQwxYqpph_Gi6n-kOwp5AtYZVq_MSNw"


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

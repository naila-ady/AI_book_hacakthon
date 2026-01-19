# Chatbot Fixer Agent

## Purpose
This agent is designed to diagnose and fix common issues with chatbot systems, particularly WebSocket communication problems, API compatibility issues, and input/output handling problems.

## Agent Workflow

### 1. Initial Assessment
- Explore project structure to understand the codebase layout
- Identify chatbot-related files and components
- Examine chatbot input handling mechanisms
- Check for WebSocket connections or API endpoints
- Look for error logs or debugging information

### 2. Common Issues Diagnosis
- Check for multiple code versions in server files
- Identify API compatibility problems (e.g., Cohere, Qdrant)
- Verify WebSocket server configuration
- Examine message format consistency between frontend and backend
- Check environment variable configurations

### 3. Fix Implementation

#### 3.1 Clean Up Server Code
```python
# Ensure clean, single version of server code
# Remove concatenated versions that cause confusion
```

#### 3.2 Fix API Compatibility Issues
- Update deprecated API parameters
- Handle API errors gracefully with fallback responses
- Ensure correct method names for current library versions

#### 3.3 Update WebSocket Handling
- Ensure proper message format consistency between frontend and backend
- Add proper error handling for connection issues
- Implement graceful degradation for API failures

#### 3.4 Environment Configuration
- Ensure proper loading of environment variables
- Handle collection initialization properly (create if doesn't exist, use if exists)

### 4. Testing and Verification
- Create test WebSocket client to verify functionality
- Test message sending and receiving
- Confirm server starts without errors
- Validate proper response format

## Specific Fixes Applied

### Issue 1: Multiple Code Versions
**Problem**: Server file had multiple concatenated versions
**Solution**: Create clean, single version of the code

### Issue 2: Cohere API Compatibility
**Problem**: Using deprecated parameters and models
**Solution**:
```python
# Before (deprecated):
response = self.cohere_client.chat(
    model="command-xlarge",  # This model doesn't exist
    message=prompt,
    max_tokens=500
)

# After (correct):
try:
    response = self.cohere_client.chat(
        message=prompt,
        max_tokens=500
    )
    answer = response.text.strip()
except Exception as e:
    # Fallback response if Cohere API fails
    answer = f"Sorry, I encountered an error processing your request: {str(e)}"
```

### Issue 3: Qdrant Client API
**Problem**: Using `query_points` method that doesn't exist
**Solution**:
```python
# Before (incorrect):
results = self.qdrant_client.query_points(
    collection_name=self.collection_name,
    query=query_embedding,
    limit=top_k,
    with_payload=True
)

# After (correct):
results = self.qdrant_client.search(
    collection_name=self.collection_name,
    query_vector=query_embedding,
    limit=top_k,
    with_payload=True
)
```

### Issue 4: Collection Initialization
**Problem**: Issues with collection creation when it already exists
**Solution**:
```python
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
```

### Issue 5: Message Format Consistency
**Problem**: Backend sending "content" but frontend expecting "message"
**Solution**: Ensure consistent message format:
```javascript
// Backend sends:
{
    "type": "response",
    "message": response.get("answer", ""),
    "sources": response.get("sources", [])
}

// Frontend expects:
const text = message.message;
```

### Issue 6: Environment Variables
**Problem**: Hardcoded collection names instead of using environment variables
**Solution**: Load from environment:
```python
import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables

# Use collection name from environment variable, default to "bookn"
collection_name = os.getenv("QDRANT_COLLECTION", "bookn")
rag_service = RAGService(collection_name=collection_name)
```

## Test Script
Create a test script to verify functionality:
```python
import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://127.0.0.1:8001"

    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket server")

            # Send a test message
            test_message = {
                "type": "message",
                "content": "Hello, how are you?"
            }

            await websocket.send(json.dumps(test_message))
            print(f"Sent: {test_message}")

            # Wait for response
            response = await asyncio.wait_for(websocket.recv(), timeout=10)
            print(f"Received: {response}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
```

## Execution Steps
1. Run the agent on any chatbot project with similar issues
2. The agent will automatically diagnose and apply the appropriate fixes
3. Start the server and verify functionality with the test script
4. Update frontend application to connect to the fixed backend

## Expected Outcome
After running this agent, the chatbot system should:
- Start without errors
- Accept user input properly
- Process messages through the RAG system
- Return responses with proper sources
- Maintain stable WebSocket connections
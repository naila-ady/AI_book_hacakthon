import asyncio
import websockets
import json
import logging

from app.services.rag_service import RAGService

# ----------------- Logging Setup -----------------
log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

file_handler = logging.FileHandler('websocket_server.log')
file_handler.setFormatter(log_formatter)
logger.addHandler(file_handler)

# ----------------- Initialize RAG Service -----------------
import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables

# Use collection name from environment variable, default to "bookn"
collection_name = os.getenv("QDRANT_COLLECTION", "bookn")
rag_service = RAGService(collection_name=collection_name)
rag_service.initialize_collection()
logger.info("RAGService initialized and collection ready.")

# ----------------- WebSocket Handler -----------------
async def handle_connection(websocket):
    logger.info(f"Client connected {websocket.remote_address}")

    try:
        while True:
            try:
                # Wait for message from client
                msg = await asyncio.wait_for(websocket.recv(), timeout=10)
                logger.info(f"Received: {msg}")

                if msg:
                    data = json.loads(msg)
                    if data.get("type") == "message":
                        user_query = data.get("content", "")
                        # Query Qdrant via RAGService
                        response = rag_service.query(user_query)

                        # Send back the answer and sources
                        await websocket.send(json.dumps({
                            "type": "response",
                            "message": response.get("answer", ""),
                            "sources": response.get("sources", [])
                        }))

            except asyncio.TimeoutError:
                # Keep-alive ping to prevent disconnect
                await websocket.send(json.dumps({"type": "keep-alive"}))
                logger.info("Sent keep-alive")

    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client disconnected: {websocket.remote_address}")
    except Exception as e:
        logger.error(f"WebSocket Error: {e}", exc_info=True)

# ----------------- Main Server -----------------
async def main():
    # Use port from environment variable or default to 8001
    port = int(os.getenv("PORT", 8001))
    server = await websockets.serve(
        handle_connection,
        "0.0.0.0",  # Listen on all interfaces for external connections
        port
    )
    logger.info(f"WebSocket server started on ws://0.0.0.0:{port}")
    await server.wait_closed()

# ----------------- Run -----------------
if __name__ == "__main__":
    asyncio.run(main())
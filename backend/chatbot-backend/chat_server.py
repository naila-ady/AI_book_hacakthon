import asyncio
import websockets
import json
import logging
from typing import Dict, Any, Optional

# Import RAGService and Config
from app.services.rag_service import RAGService
from app.config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize RAGService globally (or pass it through)
rag_service: Optional[RAGService] = None

async def handle_connection(websocket: websockets.WebSocketServerProtocol, path: str):
    global rag_service # Declare intent to modify the global rag_service
    if rag_service is None:
        try:
            rag_service = RAGService()
            rag_service.initialize_collection() # Ensure collection is ready
            logger.info("RAGService initialized successfully within WebSocket server.")
        except Exception as e:
            logger.error(f"Failed to initialize RAGService in WebSocket server: {e}", exc_info=True)
            error_response = {"type": "error", "content": f"Server error: RAGService failed to initialize. Check server logs."}
            await websocket.send(json.dumps(error_response))
            return # Exit if RAGService fails to initialize

    logger.info(f"Client connected from {websocket.remote_address} on path {path}")
    try:
        async for message_text in websocket:
            logger.info(f"Received message from {websocket.remote_address}: {message_text}")
            try:
                message: Dict[str, Any] = json.loads(message_text)
                if message.get("type") == "message" and "content" in message:
                    user_query = message["content"]
                    selected_text = message.get("selected_text")
                    logger.info(f"Processing user query: {user_query}")
                    
                    try:
                        # --- RAG Integration ---
                        rag_response = rag_service.query(query=user_query, selected_text=selected_text)
                        response_content = rag_response.get("answer", "No answer found.")
                        sources = rag_response.get("sources", [])
                        # --- End RAG Integration ---

                        response = {
                            "type": "response",
                            "content": response_content,
                            "sources": sources
                        }
                        await websocket.send(json.dumps(response))
                        logger.info(f"Sent response to {websocket.remote_address}: {response}")
                    except Exception as e:
                        logger.error(f"An error occurred during RAG query processing: {e}", exc_info=True)
                        error_response = {"type": "error", "content": f"RAG query error: {e}"}
                        await websocket.send(json.dumps(error_response))

                else:
                    logger.warning(f"Received unknown message format: {message_text}")
                    error_response = {"type": "error", "content": "Unknown message format."}
                    await websocket.send(json.dumps(error_response))
            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON from message: {message_text}")
                error_response = {"type": "error", "content": "Invalid JSON format."}
                await websocket.send(json.dumps(error_response))
            except Exception as e: # Broad catch-all for any other unexpected errors
                logger.critical(f"UNHANDLED ERROR during message processing: {e}", exc_info=True)
                error_response = {"type": "error", "content": f"Critical server error: {e}"}
                try:
                    await websocket.send(json.dumps(error_response))
                except websockets.exceptions.ConnectionClosed:
                    logger.warning("Connection closed before error message could be sent to client.")

    except websockets.exceptions.ConnectionClosedOK:
        logger.info(f"Client {websocket.remote_address} disconnected gracefully.")
    except websockets.exceptions.ConnectionClosedError as e:
        logger.error(f"Client {websocket.remote_address} disconnected with error: {e}")
    except Exception as e:
        logger.critical(f"Unexpected error in connection handler for {websocket.remote_address}: {e}", exc_info=True)


async def main():
    # Start the WebSocket server
    server = await websockets.serve(
        handle_connection, 
        "127.0.0.1", # Listen on localhost only for now
        8001,        # Port, changed to 8001 to avoid conflict with FastAPI server
    )
    logger.info("WebSocket server started on ws://127.0.0.1:8001")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
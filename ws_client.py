import asyncio
import websockets
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def connect_and_chat():
    uri = "ws://127.0.0.1:8001" # This matches the port used by chat_server.py
    
    try:
        async with websockets.connect(uri) as websocket:
            logger.info(f"Connected to {uri}")

            message = {"type": "message", "content": "What is physical AI?"}
            await websocket.send(json.dumps(message))
            logger.info(f"Sent: {message}")

            response_json = await websocket.recv()
            logger.info(f"Received: {response_json}")

    except websockets.exceptions.ConnectionClosed as e:
        logger.error(f"WebSocket connection closed unexpectedly: code={e.code}, reason={e.reason}", exc_info=True)
    except Exception as e:
        logger.error(f"Error connecting or communicating with WebSocket server: {e}", exc_info=True)

if __name__ == "__main__":
    asyncio.run(connect_and_chat())

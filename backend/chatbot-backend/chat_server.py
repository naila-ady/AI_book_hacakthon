# # import asyncio
# # import websockets
# # import json
# # import logging
# # from services.rag_service import RAGService

# # # Logging setup
# # log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
# # logger = logging.getLogger(__name__)
# # logger.setLevel(logging.DEBUG)

# # stream_handler = logging.StreamHandler()
# # stream_handler.setFormatter(log_formatter)
# # logger.addHandler(stream_handler)

# # file_handler = logging.FileHandler('websocket_server.log')
# # file_handler.setFormatter(log_formatter)
# # logger.addHandler(file_handler)

# # # Initialize RAG Service
# # rag_service = RAGService()
# # rag_service.initialize_collection()


# # async def handle_connection(websocket):
# #     logger.info(f"Client connected {websocket.remote_address}")

# #     try:
# #         while True:
# #             try:
# #                 msg = await asyncio.wait_for(websocket.recv(), timeout=10)
# #                 logger.info(f"Received: {msg}")

# #                 # Use RAGService to get an answer from the book docs
# #                 result = rag_service.query(msg)
# #                 answer = result.get("answer", "Sorry, I could not find an answer.")
# #                 sources = result.get("sources", [])

# #                 # Send response to frontend
# #                 await websocket.send(json.dumps({
# #                     "type": "response",
# #                     "message": answer,
# #                     "sources": sources  # optional, can show in frontend
# #                 }))

# #             except asyncio.TimeoutError:
# #                 # Keep-alive
# #                 await websocket.send(json.dumps({"type": "keep-alive"}))
# #                 logger.info("Sent keep-alive")

# #     except websockets.exceptions.ConnectionClosed:
# #         logger.info(f"Client disconnected: {websocket.remote_address}")
# #     except Exception as e:
# #         logger.error(f"WebSocket Error: {e}", exc_info=True)


# # async def main():
# #     server = await websockets.serve(
# #         handle_connection,
# #         "127.0.0.1",
# #         8001
# #     )
# #     logger.info("WebSocket server started on ws://127.0.0.1:8001")
# #     await server.wait_closed()


# # if __name__ == "__main__":
# #     asyncio.run(main())
# import asyncio
# import websockets
# import json
# import logging
# from app.services.rag_service import RAGService

# # Logging setup
# log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)

# stream_handler = logging.StreamHandler()
# stream_handler.setFormatter(log_formatter)
# logger.addHandler(stream_handler)

# file_handler = logging.FileHandler('websocket_server.log')
# file_handler.setFormatter(log_formatter)
# logger.addHandler(file_handler)

# # Initialize RAG service
# rag_service = RAGService()

# async def handle_connection(websocket):
#     logger.info(f"Client connected {websocket.remote_address}")

#     try:
#         while True:
#             try:
#                 msg = await asyncio.wait_for(websocket.recv(), timeout=10)
#                 logger.info(f"Received: {msg}")

#                 # Parse user message
#                 data = json.loads(msg)
#                 if data.get("type") == "message":
#                     user_question = data.get("content", "")
#                     if user_question.strip():
#                         # Query RAG service
#                         result = rag_service.query(user_question)
#                         answer = result.get("answer", "Sorry, I couldn't find an answer.")
#                         sources = result.get("sources", [])

#                         await websocket.send(json.dumps({
#                             "type": "response",
#                             "content": answer,
#                             "sources": sources
#                         }))
#                 else:
#                     await websocket.send(json.dumps({
#                         "type": "error",
#                         "content": "Unknown message type"
#                     }))

#             except asyncio.TimeoutError:
#                 await websocket.send(json.dumps({"type": "keep-alive"}))
#                 logger.info("Sent keep-alive")

#     except websockets.exceptions.ConnectionClosed:
#         logger.info(f"Client disconnected: {websocket.remote_address}")
#     except Exception as e:
#         logger.error(f"WebSocket Error: {e}", exc_info=True)

# async def main():
#     server = await websockets.serve(
#         handle_connection,
#         "127.0.0.1",
#         8001
#     )
#     logger.info("WebSocket server started on ws://127.0.0.1:8001")
#     await server.wait_closed()

# if __name__ == "__main__":
#     asyncio.run(main())
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
rag_service = RAGService()
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
                        await websocket.send(json.dumps({
                            "type": "response",
                            "content": response["answer"],
                            "sources": response["sources"]
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
    server = await websockets.serve(
        handle_connection,
        "127.0.0.1",
        8001
    )
    logger.info("WebSocket server started on ws://127.0.0.1:8001")
    await server.wait_closed()

# ----------------- Run -----------------
if __name__ == "__main__":
    asyncio.run(main())
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
rag_service = RAGService(collection_name="bookn")  # your collection name
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
                            "content": response.get("answer", ""),
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
    server = await websockets.serve(
        handle_connection,
        "127.0.0.1",
        8001
    )
    logger.info("WebSocket server started on ws://127.0.0.1:8001")
    await server.wait_closed()

# ----------------- Run -----------------
if __name__ == "__main__":
    asyncio.run(main())

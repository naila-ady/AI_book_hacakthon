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
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Chatbot Backend Running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
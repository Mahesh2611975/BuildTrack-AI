from fastapi import FastAPI

from app.auth.routes import router as auth_router

app = FastAPI(
    title="BuildTrack AI",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to BuildTrack AI 🚀"
    }
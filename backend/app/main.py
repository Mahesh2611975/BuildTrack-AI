from fastapi import FastAPI

from app.database.base import Base
from app.database.connection import engine

# Import models so SQLAlchemy knows about them
from app.models.admin import Admin
from app.models.employee import Employee

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BuildTrack AI",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to BuildTrack AI 🚀"
    }
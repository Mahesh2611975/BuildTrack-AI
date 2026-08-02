from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.project_employee import router as project_employee_router
# Authentication
from app.auth.routes import router as auth_router
from app.models.material import Material
from app.api.material_return import router as material_return_router

# APIs
from app.api.employee import router as employee_router
from app.api.contractor import router as contractor_router
from app.api.project import router as project_router
from app.api import task
from app.api.dashboard import router as dashboard_router
from app.api.attendance import router as attendance_router
from app.api.material import router as material_router
from app.api.material_issue import router as material_issue_router

# Custom Exceptions
from app.core.exceptions import (
    NotFoundException,
    BadRequestException,
)

# Create FastAPI App
app = FastAPI(
    title="BuildTrack AI",
    version="1.0.0",
    description="AI Powered Construction Management System"
)

# ==========================================================
# Global Exception Handlers
# ==========================================================

@app.exception_handler(NotFoundException)
async def not_found_exception_handler(
    request: Request,
    exc: NotFoundException,
):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": exc.message,
            "data": None,
        },
    )


@app.exception_handler(BadRequestException)
async def bad_request_exception_handler(
    request: Request,
    exc: BadRequestException,
):
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": exc.message,
            "data": None,
        },
    )

# ==========================================================
# Register Routers
# ==========================================================

app.include_router(auth_router)
app.include_router(employee_router)
app.include_router(contractor_router)
app.include_router(project_router)
app.include_router(project_employee_router)
app.include_router(task.router)
app.include_router(dashboard_router)
app.include_router(attendance_router)
app.include_router(material_router)
app.include_router(material_issue_router)
app.include_router(material_return_router)

# ==========================================================
# Root API
# ==========================================================

@app.get("/", tags=["Home"])
def root():
    return {
        "success": True,
        "message": "Welcome to BuildTrack AI 🚀",
        "version": "1.0.0",
        "data": None,
    }
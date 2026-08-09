from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.project_employee import router as project_employee_router
# Authentication
from app.auth.routes import router as auth_router
from app.models.material import Material
from app.api.material_return import router as material_return_router
from app.api.purchase_order import router as purchase_order_router
from app.api.supplier import router as supplier_router
from app.api.expense import router as expense_router
from app.api.equipment import router as equipment_router
from app.api.report import router as report_router
from app.api.payroll import router as payroll_router
# APIs
from app.api.employee import router as employee_router
from app.api.contractor import router as contractor_router
from app.api.project import router as project_router
from app.api import task
from app.api.dashboard import router as dashboard_router
from app.api.attendance import router as attendance_router
from app.api.material import router as material_router
from app.api.material_issue import router as material_issue_router
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.exception_handler import (
    http_exception_handler,
)
from app.api.salary_structure import (
    router as salary_structure_router,
)
from app.api.budget_dashboard import (
    router as budget_dashboard_router,
)
from app.api.equipment_dashboard import (
    router as equipment_dashboard_router,
)
from app.api.equipment_work_log import (
    router as equipment_work_log_router,
)
from app.api.equipment_assignment import (
    router as equipment_assignment_router,
)
from app.api.project_summary import (
    router as project_summary_router,
)
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(purchase_order_router)
app.include_router(supplier_router)
app.include_router(project_summary_router)
app.include_router(expense_router)
app.include_router(equipment_router)
app.include_router(equipment_assignment_router)
app.include_router(equipment_work_log_router)
app.include_router(equipment_dashboard_router)
app.include_router(budget_dashboard_router)
app.include_router(report_router)
app.include_router(salary_structure_router)
app.include_router(payroll_router)

app.add_exception_handler(
    HTTPException,
    http_exception_handler,
)
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


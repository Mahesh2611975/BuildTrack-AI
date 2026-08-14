from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.repository.employee_repository import EmployeeRepository

from app.reports.employee_report import (
    generate_employee_report,
)
from app.repository.project_repository import (
    ProjectRepository,
)

from app.reports.project_report import (
    generate_project_report,
)
from calendar import monthrange

from app.repository.attendance_repository import (
    AttendanceRepository,
)

from app.reports.attendance_report import (
    generate_attendance_report,
)
from app.reports.report_summary import (
    generate_management_summary,
)
router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/employee/{employee_id}")
def employee_report(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    employee = EmployeeRepository.get_employee_by_id(
        db,
        employee_id,
    )

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    pdf = generate_employee_report(employee)

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f"attachment; filename=Employee_{employee.employee_id}.pdf"
        },
    )
# ==========================================================
# PROJECT REPORT
# ==========================================================

@router.get("/project/{project_code}")
def project_report(
    project_code: str,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    project = ProjectRepository.get_project_by_code(
        db,
        project_code,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    pdf = generate_project_report(project)

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                "attachment; "
                f"filename=Project_{project.project_id}.pdf"
            )
        },
    )
# ==========================================================
# ATTENDANCE REPORT
# ==========================================================

@router.get(
    "/attendance/{employee_id}/{year}/{month}"
)
def attendance_report(
    employee_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    # ======================================================
    # VALIDATE MONTH
    # ======================================================

    if month < 1 or month > 12:

        raise HTTPException(
            status_code=400,
            detail="Month must be between 1 and 12",
        )

    # ======================================================
    # VALIDATE YEAR
    # ======================================================

    if year < 2000 or year > 2100:

        raise HTTPException(
            status_code=400,
            detail="Year must be between 2000 and 2100",
        )

    # ======================================================
    # FIND EMPLOYEE
    # ======================================================

    employee = (
        EmployeeRepository.get_employee_by_id(
            db,
            employee_id,
        )
    )

    if employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    # ======================================================
    # GET ATTENDANCE SUMMARY
    # ======================================================

    attendance = (
        AttendanceRepository
        .get_monthly_attendance_summary(
            db,
            employee_id,
            year,
            month,
        )
    )

    # ======================================================
    # TOTAL DAYS IN MONTH
    # ======================================================

    total_days = monthrange(
        year,
        month,
    )[1]

    # ======================================================
    # GENERATE PDF
    # ======================================================

    pdf = generate_attendance_report(
        employee=employee,
        attendance=attendance,
        year=year,
        month=month,
        total_days=total_days,
    )

    # ======================================================
    # RETURN PDF
    # ======================================================

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            (
                "attachment; "
                f"filename=Attendance_"
                f"{employee.employee_id}_"
                f"{year}_{month}.pdf"
            )
        },
    )
# ==========================================================
# MANAGEMENT SUMMARY
# ==========================================================

@router.get("/summary")
def management_summary(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    summary = generate_management_summary(
        db
    )

    return {
        "success": True,
        "message": "Management summary generated successfully",
        "data": summary,
    }
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

@router.get("/project/{project_id}")
def project_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    project = (
        ProjectRepository.get_project_by_id(
            db,
            project_id,
        )
    )

    if project is None:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    pdf = generate_project_report(
        project
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            (
                "attachment; "
                f"filename=Project_"
                f"{project.project_id}.pdf"
            )
        },
    )
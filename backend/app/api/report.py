from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.repository.employee_repository import EmployeeRepository

from app.reports.employee_report import (
    generate_employee_report,
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
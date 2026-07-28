from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.project_employee import (
    AssignEmployeeRequest,
    ProjectEmployeeResponse,
)

from app.services.project_employee_service import (
    ProjectEmployeeService,
)

router = APIRouter(
    prefix="/projects",
    tags=["Project Employees"],
)


@router.post(
    "/{project_id}/employees",
    response_model=ProjectEmployeeResponse,
)
def assign_employee(
    project_id: int,
    request: AssignEmployeeRequest,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ProjectEmployeeService.assign_employee(
        db,
        project_id,
        request.employee_id,
    )


@router.get(
    "/{project_id}/employees",
    response_model=list[ProjectEmployeeResponse],
)
def get_project_employees(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ProjectEmployeeService.get_project_employees(
        db,
        project_id,
    )


@router.delete(
    "/{project_id}/employees/{employee_id}",
)
def remove_employee(
    project_id: int,
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    assignment = ProjectEmployeeService.remove_employee(
        db,
        project_id,
        employee_id,
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    return {
        "message": "Employee removed from project successfully"
    }
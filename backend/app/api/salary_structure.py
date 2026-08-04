from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.salary_structure import (
    SalaryStructureCreate,
    SalaryStructureUpdate,
    SalaryStructureResponse,
)

from app.services.salary_structure_service import (
    SalaryStructureService,
)

router = APIRouter(
    prefix="/salary-structure",
    tags=["Salary Structure"],
)


@router.post(
    "/",
    response_model=SalaryStructureResponse,
)
def create_salary_structure(
    request: SalaryStructureCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    salary = SalaryStructureService.create_salary_structure(
        db,
        request,
    )

    if salary is None:
        raise HTTPException(
            status_code=400,
            detail="Salary structure already exists",
        )

    return salary


@router.get(
    "/",
    response_model=list[SalaryStructureResponse],
)
def get_all_salary_structures(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return SalaryStructureService.get_all_salary_structures(db)


@router.put(
    "/{employee_id}",
    response_model=SalaryStructureResponse,
)
def update_salary_structure(
    employee_id: int,
    request: SalaryStructureUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    salary = SalaryStructureService.update_salary(
        db,
        employee_id,
        request,
    )

    if salary is None:
        raise HTTPException(
            status_code=404,
            detail="Salary structure not found",
        )

    return salary
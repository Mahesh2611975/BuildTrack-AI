from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.auth.dependencies import (
    get_current_admin,
)

from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
)

from app.services.employee_service import (
    EmployeeService,
)


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


# =========================================================
# CREATE EMPLOYEE
# =========================================================

@router.post(
    "",
    response_model=EmployeeResponse,
)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    try:

        return EmployeeService.create_employee(
            db,
            employee,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# =========================================================
# GET ALL EMPLOYEES
# =========================================================

@router.get(
    "",
    response_model=list[EmployeeResponse],
)
def get_all_employees(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return EmployeeService.get_all_employees(
        db
    )


# =========================================================
# GET EMPLOYEE
# =========================================================

@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    employee = (
        EmployeeService.get_employee_by_id(
            db,
            employee_id,
        )
    )

    if employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return employee


# =========================================================
# UPDATE EMPLOYEE
# =========================================================

@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    try:

        updated_employee = (
            EmployeeService.update_employee(
                db,
                employee_id,
                employee,
            )
        )

        if updated_employee is None:

            raise HTTPException(
                status_code=404,
                detail="Employee not found",
            )

        return updated_employee

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# =========================================================
# DELETE EMPLOYEE
# =========================================================

@router.delete(
    "/{employee_id}"
)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    employee = (
        EmployeeService.delete_employee(
            db,
            employee_id,
        )
    )

    if employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return {
        "message": "Employee deleted successfully"
    }
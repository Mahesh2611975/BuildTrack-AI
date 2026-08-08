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

from app.schemas.payroll import (
    PayrollResponse,
)

from app.services.payroll_service import (
    PayrollService,
)


router = APIRouter(
    prefix="/payroll",
    tags=["Payroll"],
)


@router.get(
    "/{employee_id}/{year}/{month}",
    response_model=PayrollResponse,
)
def generate_payroll(
    employee_id: int,
    year: int,
    month: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_admin
    ),
):

    payroll = (
        PayrollService.generate_payroll(
            db,
            employee_id,
            year,
            month,
        )
    )

    # Employee not found
    if payroll is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    # Salary structure missing
    if payroll == "salary_not_found":

        raise HTTPException(
            status_code=404,
            detail="Salary structure not found",
        )

    # Invalid month
    if payroll == "invalid_month":

        raise HTTPException(
            status_code=400,
            detail="Month must be between 1 and 12",
        )

    return payroll
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

from app.services.payroll_service import (
    PayrollService,
)


router = APIRouter(
    prefix="/payroll-history",
    tags=["Payroll History"],
)


# ==========================================================
# GET ALL PAYROLL HISTORY
# ==========================================================

@router.get("")
def get_all_payroll(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return PayrollService.get_all_payroll(
        db
    )


# ==========================================================
# GET PAYROLL BY ID
# ==========================================================

@router.get("/{payroll_id}")
def get_payroll_by_id(
    payroll_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    payroll = PayrollService.get_payroll_by_id(
        db,
        payroll_id,
    )

    if payroll is None:

        raise HTTPException(
            status_code=404,
            detail="Payroll record not found",
        )

    return payroll


# ==========================================================
# GET EMPLOYEE PAYROLL HISTORY
# ==========================================================

@router.get("/employee/{employee_id}")
def get_employee_payroll(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return PayrollService.get_employee_payroll(
        db,
        employee_id,
    )


# ==========================================================
# DELETE PAYROLL
# ==========================================================

@router.delete("/{payroll_id}")
def delete_payroll(
    payroll_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    payroll = PayrollService.delete_payroll(
        db,
        payroll_id,
    )

    if payroll is None:

        raise HTTPException(
            status_code=404,
            detail="Payroll record not found",
        )

    return {
        "success": True,
        "message": "Payroll deleted successfully",
    }
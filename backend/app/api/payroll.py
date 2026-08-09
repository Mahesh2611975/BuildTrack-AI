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

from app.schemas.payroll import PayrollResponse

from app.services.payroll_service import (
    PayrollService,
)
from fastapi.responses import StreamingResponse
from app.reports.payslip_pdf import PayslipPDF

router = APIRouter(
    prefix="/payroll",
    tags=["Payroll"],
)


# ==========================================================
# GENERATE PAYROLL
# ==========================================================

@router.get(
    "/{employee_id}/{year}/{month}",
    response_model=PayrollResponse,
)
def generate_payroll(
    employee_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    payroll = PayrollService.generate_payroll(
        db,
        employee_id,
        year,
        month,
    )

    if payroll is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    if payroll == "salary_not_found":
        raise HTTPException(
            status_code=404,
            detail="Salary structure not found",
        )

    return payroll
# ==========================================================
# SAVE PAYROLL
# ==========================================================

@router.post("/save")
def save_payroll(
    employee_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    # Generate the latest payroll calculation
    payroll = PayrollService.generate_payroll(
        db,
        employee_id,
        year,
        month,
    )

    # Employee not found
    if payroll is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    # Salary structure not found
    if payroll == "salary_not_found":

        raise HTTPException(
            status_code=404,
            detail="Salary structure not found",
        )

    # Save payroll
    saved_payroll = (
        PayrollService.save_payroll(
            db,
            payroll,
        )
    )

    return {
        "success": True,
        "message": "Payroll saved successfully",
        "data": saved_payroll,
    }

@router.get(
    "/{employee_id}/{year}/{month}/payslip",
)
def download_payslip(
    employee_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    payroll = PayrollService.generate_payroll(
        db,
        employee_id,
        year,
        month,
    )

    if payroll is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    if payroll == "salary_not_found":
        raise HTTPException(
            status_code=404,
            detail="Salary structure not found",
        )

    pdf = PayslipPDF.generate(payroll)

    filename = (
        f"payslip_"
        f"{payroll['employee_id']}_"
        f"{year}_{month}.pdf"
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{filename}"'
            )
        },
    )
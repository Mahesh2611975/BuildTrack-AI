from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from fastapi.responses import StreamingResponse

from app.database.session import get_db

from app.auth.dependencies import (
    get_current_admin,
)

from app.schemas.payroll import PayrollResponse

from app.services.payroll_service import (
    PayrollService,
)

from app.reports.payslip_pdf import PayslipPDF


# ==========================================================
# ROUTER
# ==========================================================

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

    # ------------------------------------------------------
    # EMPLOYEE NOT FOUND
    # ------------------------------------------------------

    if payroll is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    # ------------------------------------------------------
    # SALARY STRUCTURE NOT FOUND
    # ------------------------------------------------------

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

    try:

        # --------------------------------------------------
        # GENERATE LATEST PAYROLL CALCULATION
        # --------------------------------------------------

        payroll = PayrollService.generate_payroll(
            db,
            employee_id,
            year,
            month,
        )

        # --------------------------------------------------
        # EMPLOYEE NOT FOUND
        # --------------------------------------------------

        if payroll is None:
            raise HTTPException(
                status_code=404,
                detail="Employee not found",
            )

        # --------------------------------------------------
        # SALARY STRUCTURE NOT FOUND
        # --------------------------------------------------

        if payroll == "salary_not_found":
            raise HTTPException(
                status_code=404,
                detail="Salary structure not found",
            )

        # --------------------------------------------------
        # SAVE / FINALIZE PAYROLL
        # --------------------------------------------------

        saved_payroll = PayrollService.save_payroll(
            db,
            payroll,
        )

        # --------------------------------------------------
        # SUCCESS RESPONSE
        # --------------------------------------------------

        return {
            "success": True,
            "message": "Payroll saved successfully",
            "data": saved_payroll,
        }

    except ValueError as e:

        # --------------------------------------------------
        # FINALIZED PAYROLL PROTECTION
        # --------------------------------------------------
        #
        # Example:
        #
        # Payroll already finalized for 8/2026.
        # Historical payroll cannot be overwritten.
        #
        # Return 409 instead of 500.
        # --------------------------------------------------

        raise HTTPException(
            status_code=409,
            detail=str(e),
        )


# ==========================================================
# DOWNLOAD PAYSLIP
# ==========================================================

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

    # ------------------------------------------------------
    # GENERATE PAYROLL DATA
    # ------------------------------------------------------

    payroll = PayrollService.generate_payroll(
        db,
        employee_id,
        year,
        month,
    )

    # ------------------------------------------------------
    # EMPLOYEE NOT FOUND
    # ------------------------------------------------------

    if payroll is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    # ------------------------------------------------------
    # SALARY STRUCTURE NOT FOUND
    # ------------------------------------------------------

    if payroll == "salary_not_found":
        raise HTTPException(
            status_code=404,
            detail="Salary structure not found",
        )

    # ------------------------------------------------------
    # GENERATE PDF
    # ------------------------------------------------------

    pdf = PayslipPDF.generate(
        payroll
    )

    # ------------------------------------------------------
    # FILE NAME
    # ------------------------------------------------------

    filename = (
        f"payslip_"
        f"{payroll['employee_id']}_"
        f"{year}_"
        f"{month}.pdf"
    )

    # ------------------------------------------------------
    # RETURN PDF
    # ------------------------------------------------------

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{filename}"'
            )
        },
    )
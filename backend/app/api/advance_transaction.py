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

from app.schemas.advance_transaction import (
    AdvanceTransactionCreate,
    AdvanceTransactionResponse,
)

from app.services.advance_transaction_service import (
    AdvanceTransactionService,
)


router = APIRouter(
    prefix="/advance-transactions",
    tags=["Advance Transactions"],
)


# ==========================================================
# CREATE ADVANCE RECOVERY
# ==========================================================

@router.post(
    "/",
    response_model=AdvanceTransactionResponse,
)
def create_transaction(
    request: AdvanceTransactionCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    try:

        transaction = (
            AdvanceTransactionService
            .create_transaction(
                db,
                request,
            )
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    if transaction is None:

        raise HTTPException(
            status_code=404,
            detail="Advance not found",
        )

    return transaction


# ==========================================================
# GET ALL RECOVERIES
# ==========================================================

@router.get(
    "/",
    response_model=list[
        AdvanceTransactionResponse
    ],
)
def get_all_transactions(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return (
        AdvanceTransactionService
        .get_all_transactions(
            db
        )
    )


# ==========================================================
# GET RECOVERIES BY EMPLOYEE
# ==========================================================

@router.get(
    "/employee/{employee_id}",
    response_model=list[
        AdvanceTransactionResponse
    ],
)
def get_transactions_by_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return (
        AdvanceTransactionService
        .get_transactions_by_employee(
            db,
            employee_id,
        )
    )


# ==========================================================
# GET RECOVERIES BY ADVANCE
# ==========================================================

@router.get(
    "/advance/{advance_id}",
    response_model=list[
        AdvanceTransactionResponse
    ],
)
def get_transactions_by_advance(
    advance_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return (
        AdvanceTransactionService
        .get_transactions_by_advance(
            db,
            advance_id,
        )
    )


# ==========================================================
# GET RECOVERY BY ID
# ==========================================================

@router.get(
    "/{transaction_id}",
    response_model=AdvanceTransactionResponse,
)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    transaction = (
        AdvanceTransactionService
        .get_transaction_by_id(
            db,
            transaction_id,
        )
    )

    if transaction is None:

        raise HTTPException(
            status_code=404,
            detail="Advance recovery not found",
        )

    return transaction


# ==========================================================
# DELETE RECOVERY
# ==========================================================

@router.delete(
    "/{transaction_id}",
)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    deleted = (
        AdvanceTransactionService
        .delete_transaction(
            db,
            transaction_id,
        )
    )

    if deleted is None:

        raise HTTPException(
            status_code=404,
            detail="Advance recovery not found",
        )

    return {
        "success": True,
        "message": (
            "Advance recovery deleted successfully"
        ),
    }
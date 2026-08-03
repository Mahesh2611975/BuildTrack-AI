from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
)

from app.services.expense_service import (
    ExpenseService,
)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


@router.post(
    "/",
    response_model=ExpenseResponse,
)
def create_expense(
    request: ExpenseCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ExpenseService.create_expense(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[ExpenseResponse],
)
def get_all_expenses(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ExpenseService.get_all_expenses(db)


@router.get(
    "/project/{project_id}",
    response_model=list[ExpenseResponse],
)
def get_expenses_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ExpenseService.get_expenses_by_project(
        db,
        project_id,
    )


@router.put(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def update_expense(
    expense_id: int,
    request: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    expense = ExpenseService.update_expense(
        db,
        expense_id,
        request,
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return expense


@router.delete(
    "/{expense_id}",
)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    deleted = ExpenseService.delete_expense(
        db,
        expense_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return {
        "message": "Expense deleted successfully"
    }
from sqlalchemy.orm import Session

from app.models.expense import Expense

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
)

from app.repository.expense_repository import (
    ExpenseRepository,
)


class ExpenseService:

    @staticmethod
    def create_expense(
        db: Session,
        request: ExpenseCreate,
    ):
        expense = Expense(
            expense_code=request.expense_code,
            project_id=request.project_id,
            category=request.category,
            amount=request.amount,
            expense_date=request.expense_date,
            description=request.description,
        )

        return ExpenseRepository.create_expense(
            db,
            expense,
        )

    @staticmethod
    def get_all_expenses(
        db: Session,
    ):
        return ExpenseRepository.get_all_expenses(db)

    @staticmethod
    def get_expenses_by_project(
        db: Session,
        project_id: int,
    ):
        return ExpenseRepository.get_expenses_by_project(
            db,
            project_id,
        )

    @staticmethod
    def update_expense(
        db: Session,
        expense_id: int,
        request: ExpenseUpdate,
    ):
        expense = ExpenseRepository.get_expense_by_id(
            db,
            expense_id,
        )

        if expense is None:
            return None

        expense.category = request.category
        expense.amount = request.amount
        expense.expense_date = request.expense_date
        expense.description = request.description

        return ExpenseRepository.update_expense(
            db,
            expense,
        )

    @staticmethod
    def delete_expense(
        db: Session,
        expense_id: int,
    ):
        expense = ExpenseRepository.get_expense_by_id(
            db,
            expense_id,
        )

        if expense is None:
            return None

        ExpenseRepository.delete_expense(
            db,
            expense,
        )

        return True
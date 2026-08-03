from sqlalchemy.orm import Session

from app.models.expense import Expense


class ExpenseRepository:

    @staticmethod
    def create_expense(
        db: Session,
        expense: Expense,
    ):
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def get_all_expenses(
        db: Session,
    ):
        return db.query(Expense).all()

    @staticmethod
    def get_expense_by_id(
        db: Session,
        expense_id: int,
    ):
        return (
            db.query(Expense)
            .filter(Expense.id == expense_id)
            .first()
        )

    @staticmethod
    def get_expenses_by_project(
        db: Session,
        project_id: int,
    ):
        return (
            db.query(Expense)
            .filter(Expense.project_id == project_id)
            .all()
        )

    @staticmethod
    def update_expense(
        db: Session,
        expense: Expense,
    ):
        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def delete_expense(
        db: Session,
        expense: Expense,
    ):
        db.delete(expense)
        db.commit()
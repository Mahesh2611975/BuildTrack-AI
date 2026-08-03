from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.expense import Expense


class BudgetDashboardRepository:

    @staticmethod
    def get_budget_dashboard(
        db: Session,
        project_id: int,
    ):
        project = (
            db.query(Project)
            .filter(Project.id == project_id)
            .first()
        )

        if project is None:
            return None

        total_expenses = (
            db.query(
                func.sum(Expense.amount)
            )
            .filter(
                Expense.project_id == project_id
            )
            .scalar()
            or 0
        )

        remaining = (
            project.budget - total_expenses
        )

        percentage = 0

        if project.budget > 0:
            percentage = (
                total_expenses
                / project.budget
            ) * 100

        return {
            "project_budget": project.budget,
            "total_expenses": total_expenses,
            "remaining_budget": remaining,
            "budget_used_percentage": round(
                percentage,
                2,
            ),
        }
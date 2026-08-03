from sqlalchemy.orm import Session

from app.repository.budget_dashboard_repository import (
    BudgetDashboardRepository,
)


class BudgetDashboardService:

    @staticmethod
    def get_budget_dashboard(
        db: Session,
        project_id: int,
    ):
        return (
            BudgetDashboardRepository.get_budget_dashboard(
                db,
                project_id,
            )
        )
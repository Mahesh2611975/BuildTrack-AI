from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.budget_dashboard import (
    BudgetDashboardResponse,
)

from app.services.budget_dashboard_service import (
    BudgetDashboardService,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Budget Dashboard"],
)


@router.get(
    "/budget/{project_id}",
    response_model=BudgetDashboardResponse,
)
def get_budget_dashboard(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    dashboard = BudgetDashboardService.get_budget_dashboard(
        db,
        project_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return dashboard
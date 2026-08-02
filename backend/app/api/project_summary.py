from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.project_summary import (
    ProjectSummaryResponse,
)

from app.services.project_summary_service import (
    ProjectSummaryService,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/project-summary",
    response_model=ProjectSummaryResponse,
)
def get_project_summary(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ProjectSummaryService.get_summary(db)
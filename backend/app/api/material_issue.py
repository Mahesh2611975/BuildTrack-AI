from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.material_issue import (
    MaterialIssueCreate,
    MaterialIssueResponse,
)

from app.services.material_issue_service import (
    MaterialIssueService,
)

router = APIRouter(
    prefix="/material-issues",
    tags=["Material Issues"],
)


@router.post(
    "/",
    response_model=MaterialIssueResponse,
)
def issue_material(
    request: MaterialIssueCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    result = MaterialIssueService.issue_material(
        db,
        request,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Material not found",
        )

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock",
        )

    return result


@router.get(
    "/",
    response_model=list[MaterialIssueResponse],
)
def get_all_material_issues(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return MaterialIssueService.get_all_issues(db)
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

from app.schemas.advance import (
    AdvanceCreate,
    AdvanceUpdate,
    AdvanceResponse,
)

from app.services.advance_service import (
    AdvanceService,
)


router = APIRouter(
    prefix="/advances",
    tags=["Advances"],
)


# ==========================================================
# CREATE ADVANCE
# ==========================================================

@router.post(
    "/",
    response_model=AdvanceResponse,
)
def create_advance(
    request: AdvanceCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return AdvanceService.create_advance(
        db,
        request,
    )


# ==========================================================
# GET ALL ADVANCES
# ==========================================================

@router.get(
    "/",
    response_model=list[AdvanceResponse],
)
def get_all_advances(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return AdvanceService.get_all_advances(
        db
    )


# ==========================================================
# GET ADVANCES BY EMPLOYEE
# ==========================================================

@router.get(
    "/employee/{employee_id}",
    response_model=list[AdvanceResponse],
)
def get_advances_by_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    return AdvanceService.get_advances_by_employee(
        db,
        employee_id,
    )


# ==========================================================
# GET ADVANCE BY ID
# ==========================================================

@router.get(
    "/{advance_id}",
    response_model=AdvanceResponse,
)
def get_advance_by_id(
    advance_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    advance = AdvanceService.get_advance_by_id(
        db,
        advance_id,
    )

    if advance is None:
        raise HTTPException(
            status_code=404,
            detail="Advance not found",
        )

    return advance


# ==========================================================
# UPDATE ADVANCE
# ==========================================================

@router.put(
    "/{advance_id}",
    response_model=AdvanceResponse,
)
def update_advance(
    advance_id: int,
    request: AdvanceUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    advance = AdvanceService.update_advance(
        db,
        advance_id,
        request,
    )

    if advance is None:
        raise HTTPException(
            status_code=404,
            detail="Advance not found",
        )

    return advance


# ==========================================================
# DELETE ADVANCE
# ==========================================================

@router.delete(
    "/{advance_id}",
)
def delete_advance(
    advance_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    deleted = AdvanceService.delete_advance(
        db,
        advance_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Advance not found",
        )

    return {
        "message": "Advance deleted successfully"
    }
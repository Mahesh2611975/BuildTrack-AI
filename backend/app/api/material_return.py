from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.material_return import (
    MaterialReturnCreate,
    MaterialReturnResponse,
)

from app.services.material_return_service import (
    MaterialReturnService,
)

router = APIRouter(
    prefix="/material-returns",
    tags=["Material Returns"],
)


@router.post(
    "/",
    response_model=MaterialReturnResponse,
)
def return_material(
    request: MaterialReturnCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    result = MaterialReturnService.return_material(
        db,
        request,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Material issue not found",
        )

    if result is False:
        raise HTTPException(
            status_code=400,
            detail="Return quantity exceeds issued quantity",
        )

    return result


@router.get(
    "/",
    response_model=list[MaterialReturnResponse],
)
def get_all_returns(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return MaterialReturnService.get_all_returns(db)
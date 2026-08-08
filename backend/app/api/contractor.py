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

from app.schemas.contractor import (
    ContractorCreate,
    ContractorUpdate,
    ContractorResponse,
)

from app.services.contractor_service import (
    ContractorService,
)

from app.core.exceptions import (
    NotFoundException,
)


router = APIRouter(
    prefix="/contractors",
    tags=["Contractors"],
)


# ==========================================
# CREATE CONTRACTOR
# ==========================================

@router.post(
    "",
    response_model=ContractorResponse,
)
def create_contractor(
    contractor: ContractorCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ContractorService.create_contractor(
        db,
        contractor,
    )


# ==========================================
# GET ALL CONTRACTORS
# ==========================================

@router.get(
    "",
    response_model=list[ContractorResponse],
)
def get_all_contractors(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ContractorService.get_all_contractors(
        db
    )


# ==========================================
# GET CONTRACTOR
# ==========================================

@router.get(
    "/{contractor_id}",
    response_model=ContractorResponse,
)
def get_contractor(
    contractor_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    contractor = (
        ContractorService.get_contractor_by_id(
            db,
            contractor_id,
        )
    )

    if contractor is None:
        raise HTTPException(
            status_code=404,
            detail="Contractor not found",
        )

    return contractor


# ==========================================
# UPDATE CONTRACTOR
# ==========================================

@router.put(
    "/{contractor_id}",
    response_model=ContractorResponse,
)
def update_contractor(
    contractor_id: int,
    contractor: ContractorUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    updated_contractor = (
        ContractorService.update_contractor(
            db,
            contractor_id,
            contractor,
        )
    )

    if updated_contractor is None:
        raise HTTPException(
            status_code=404,
            detail="Contractor not found",
        )

    return updated_contractor


# ==========================================
# DELETE CONTRACTOR
# ==========================================

@router.delete(
    "/{contractor_id}"
)
def delete_contractor(
    contractor_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    contractor = (
        ContractorService.delete_contractor(
            db,
            contractor_id,
        )
    )

    if contractor is None:
        raise NotFoundException(
            "Contractor not found"
        )

    return {
        "success": True,
        "message": "Contractor deleted successfully",
        "data": None,
    }
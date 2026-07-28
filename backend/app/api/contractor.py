from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.contractor import (
    ContractorCreate,
    ContractorUpdate,
    ContractorResponse,
)

from app.services.contractor_service import ContractorService

router = APIRouter(
    prefix="/contractors",
    tags=["Contractors"],
)


@router.post("", response_model=ContractorResponse)
def create_contractor(
    contractor: ContractorCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ContractorService.create_contractor(db, contractor)


@router.get("", response_model=list[ContractorResponse])
def get_all_contractors(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ContractorService.get_all_contractors(db)


@router.get("/{contractor_id}", response_model=ContractorResponse)
def get_contractor(
    contractor_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    contractor = ContractorService.get_contractor_by_id(
        db,
        contractor_id,
    )

    if contractor is None:
        raise HTTPException(
            status_code=404,
            detail="Contractor not found",
        )

    return contractor


@router.put("/{contractor_id}", response_model=ContractorResponse)
def update_contractor(
    contractor_id: int,
    contractor: ContractorUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    contractor = ContractorService.update_contractor(
        db,
        contractor_id,
        contractor,
    )

    if contractor is None:
        raise HTTPException(
            status_code=404,
            detail="Contractor not found",
        )

    return contractor


@router.delete("/{contractor_id}")
def delete_contractor(
    contractor_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    contractor = ContractorService.delete_contractor(
        db,
        contractor_id,
    )

    if contractor is None:
       from app.core.exceptions import NotFoundException
       raise NotFoundException("Contractor not found")
    return {
        "message": "Contractor deleted successfully"
    }
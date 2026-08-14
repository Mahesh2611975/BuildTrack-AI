from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.equipment import (
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentResponse,
)

from app.services.equipment_service import (
    EquipmentService,
)

router = APIRouter(
    prefix="/equipment",
    tags=["Equipment"],
)


@router.post(
    "/",
    response_model=EquipmentResponse,
)
def create_equipment(
    request: EquipmentCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EquipmentService.create_equipment(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[EquipmentResponse],
)
def get_all_equipment(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EquipmentService.get_all_equipment(db)

# ==========================================================
# GET EQUIPMENT BY ID
# ==========================================================

@router.get(
    "/{equipment_id}",
    response_model=EquipmentResponse,
)
def get_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):

    equipment = EquipmentService.get_equipment_by_id(
        db,
        equipment_id,
    )

    if equipment is None:
        raise HTTPException(
            status_code=404,
            detail="Equipment not found",
        )

    return equipment

@router.put(
    "/{equipment_id}",
    response_model=EquipmentResponse,
)
def update_equipment(
    equipment_id: int,
    request: EquipmentUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    equipment = EquipmentService.update_equipment(
        db,
        equipment_id,
        request,
    )

    if equipment is None:
        raise HTTPException(
            status_code=404,
            detail="Equipment not found",
        )

    return equipment


@router.delete(
    "/{equipment_id}",
)
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    deleted = EquipmentService.delete_equipment(
        db,
        equipment_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Equipment not found",
        )

    return {
        "message": "Equipment deleted successfully"
    }
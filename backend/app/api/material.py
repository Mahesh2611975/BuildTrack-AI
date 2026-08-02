from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.material import (
    MaterialCreate,
    MaterialUpdate,
    MaterialResponse,
)

from app.services.material_service import MaterialService

router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
)


@router.post(
    "/",
    response_model=MaterialResponse,
)
def create_material(
    request: MaterialCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return MaterialService.create_material(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[MaterialResponse],
)
def get_all_materials(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return MaterialService.get_all_materials(db)


@router.put(
    "/{material_id}",
    response_model=MaterialResponse,
)
def update_material(
    material_id: int,
    request: MaterialUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    material = MaterialService.update_material(
        db,
        material_id,
        request,
    )

    if material is None:
        raise HTTPException(
            status_code=404,
            detail="Material not found",
        )

    return material


@router.delete(
    "/{material_id}",
)
def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    deleted = MaterialService.delete_material(
        db,
        material_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Material not found",
        )

    return {
        "message": "Material deleted successfully"
    }
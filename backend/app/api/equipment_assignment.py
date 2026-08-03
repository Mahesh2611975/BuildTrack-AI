from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.equipment_assignment import (
    EquipmentAssignmentCreate,
    EquipmentAssignmentUpdate,
    EquipmentAssignmentResponse,
)

from app.services.equipment_assignment_service import (
    EquipmentAssignmentService,
)

router = APIRouter(
    prefix="/equipment-assignments",
    tags=["Equipment Assignments"],
)


@router.post(
    "/",
    response_model=EquipmentAssignmentResponse,
)
def assign_equipment(
    request: EquipmentAssignmentCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    assignment = (
        EquipmentAssignmentService.assign_equipment(
            db,
            request,
        )
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Equipment not found",
        )

    if assignment is False:
        raise HTTPException(
            status_code=400,
            detail="Equipment is already assigned",
        )

    return assignment


@router.get(
    "/",
    response_model=list[EquipmentAssignmentResponse],
)
def get_all_assignments(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EquipmentAssignmentService.get_all_assignments(db)


@router.put(
    "/{assignment_id}",
    response_model=EquipmentAssignmentResponse,
)
def update_assignment(
    assignment_id: int,
    request: EquipmentAssignmentUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    assignment = (
        EquipmentAssignmentService.update_assignment(
            db,
            assignment_id,
            request,
        )
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    return assignment
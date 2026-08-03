from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.equipment_work_log import (
    EquipmentWorkLogCreate,
    EquipmentWorkLogResponse,
)

from app.services.equipment_work_log_service import (
    EquipmentWorkLogService,
)

router = APIRouter(
    prefix="/equipment-work-logs",
    tags=["Equipment Work Logs"],
)


@router.post(
    "/",
    response_model=EquipmentWorkLogResponse,
)
def create_work_log(
    request: EquipmentWorkLogCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EquipmentWorkLogService.create_work_log(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[EquipmentWorkLogResponse],
)
def get_all_work_logs(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EquipmentWorkLogService.get_all_work_logs(
        db,
    )
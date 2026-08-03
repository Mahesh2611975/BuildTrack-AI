from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.equipment_dashboard import (
    EquipmentDashboardResponse,
)

from app.services.equipment_dashboard_service import (
    EquipmentDashboardService,
)

router = APIRouter(
    prefix="/equipment",
    tags=["Equipment Dashboard"],
)


@router.get(
    "/dashboard",
    response_model=EquipmentDashboardResponse,
)
def get_equipment_dashboard(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EquipmentDashboardService.get_dashboard(db)
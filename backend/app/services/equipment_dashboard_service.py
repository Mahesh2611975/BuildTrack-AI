from sqlalchemy.orm import Session

from app.repository.equipment_dashboard_repository import (
    EquipmentDashboardRepository,
)


class EquipmentDashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
    ):
        return (
            EquipmentDashboardRepository.get_dashboard(
                db,
            )
        )
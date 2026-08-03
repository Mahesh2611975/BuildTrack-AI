from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.equipment import Equipment
from app.models.equipment_work_log import EquipmentWorkLog


class EquipmentDashboardRepository:

    @staticmethod
    def get_dashboard(db: Session):

        total_equipment = db.query(
            Equipment
        ).count()

        available_equipment = (
            db.query(Equipment)
            .filter(
                Equipment.status == "Available"
            )
            .count()
        )

        in_use_equipment = (
            db.query(Equipment)
            .filter(
                Equipment.status == "In Use"
            )
            .count()
        )

        maintenance_equipment = (
            db.query(Equipment)
            .filter(
                Equipment.status == "Maintenance"
            )
            .count()
        )

        total_hours = (
            db.query(
                func.sum(
                    EquipmentWorkLog.working_hours
                )
            ).scalar() or 0
        )

        total_cost = (
            db.query(
                func.sum(
                    EquipmentWorkLog.total_cost
                )
            ).scalar() or 0
        )

        return {
            "total_equipment": total_equipment,
            "available_equipment": available_equipment,
            "in_use_equipment": in_use_equipment,
            "maintenance_equipment": maintenance_equipment,
            "total_working_hours": total_hours,
            "total_equipment_cost": total_cost,
        }
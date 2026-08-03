from datetime import datetime

from sqlalchemy.orm import Session

from app.models.equipment_work_log import EquipmentWorkLog

from app.schemas.equipment_work_log import (
    EquipmentWorkLogCreate,
)

from app.repository.equipment_work_log_repository import (
    EquipmentWorkLogRepository,
)


class EquipmentWorkLogService:

    @staticmethod
    def create_work_log(
        db: Session,
        request: EquipmentWorkLogCreate,
    ):
        start = datetime.combine(
            request.work_date,
            request.start_time,
        )

        end = datetime.combine(
            request.work_date,
            request.end_time,
        )

        working_hours = (
            end - start
        ).total_seconds() / 3600

        total_cost = (
            working_hours * request.hourly_rate
        )

        work_log = EquipmentWorkLog(
            assignment_id=request.assignment_id,
            work_date=request.work_date,
            start_time=request.start_time,
            end_time=request.end_time,
            hourly_rate=request.hourly_rate,
            working_hours=working_hours,
            total_cost=total_cost,
            remarks=request.remarks,
        )

        return EquipmentWorkLogRepository.create_work_log(
            db,
            work_log,
        )

    @staticmethod
    def get_all_work_logs(
        db: Session,
    ):
        return EquipmentWorkLogRepository.get_all_work_logs(
            db,
        )
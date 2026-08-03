from sqlalchemy.orm import Session

from app.models.equipment_work_log import EquipmentWorkLog


class EquipmentWorkLogRepository:

    @staticmethod
    def create_work_log(
        db: Session,
        work_log: EquipmentWorkLog,
    ):
        db.add(work_log)
        db.commit()
        db.refresh(work_log)
        return work_log

    @staticmethod
    def get_all_work_logs(
        db: Session,
    ):
        return db.query(EquipmentWorkLog).all()
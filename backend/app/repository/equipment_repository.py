from sqlalchemy.orm import Session

from app.models.equipment import Equipment


class EquipmentRepository:

    @staticmethod
    def create_equipment(
        db: Session,
        equipment: Equipment,
    ):
        db.add(equipment)
        db.commit()
        db.refresh(equipment)
        return equipment

    @staticmethod
    def get_all_equipment(
        db: Session,
    ):
        return db.query(Equipment).all()

    @staticmethod
    def get_equipment_by_id(
        db: Session,
        equipment_id: int,
    ):
        return (
            db.query(Equipment)
            .filter(Equipment.id == equipment_id)
            .first()
        )

    @staticmethod
    def update_equipment(
        db: Session,
        equipment: Equipment,
    ):
        db.commit()
        db.refresh(equipment)
        return equipment

    @staticmethod
    def delete_equipment(
        db: Session,
        equipment: Equipment,
    ):
        db.delete(equipment)
        db.commit()
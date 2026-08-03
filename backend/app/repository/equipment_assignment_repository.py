from sqlalchemy.orm import Session

from app.models.equipment import Equipment
from app.models.equipment_assignment import EquipmentAssignment


class EquipmentAssignmentRepository:

    @staticmethod
    def create_assignment(
        db: Session,
        assignment: EquipmentAssignment,
    ):
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def get_all_assignments(
        db: Session,
    ):
        return db.query(EquipmentAssignment).all()

    @staticmethod
    def get_assignment_by_id(
        db: Session,
        assignment_id: int,
    ):
        return (
            db.query(EquipmentAssignment)
            .filter(EquipmentAssignment.id == assignment_id)
            .first()
        )

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
    def update_assignment(
        db: Session,
        assignment: EquipmentAssignment,
    ):
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def update_equipment(
        db: Session,
        equipment: Equipment,
    ):
        db.commit()
        db.refresh(equipment)
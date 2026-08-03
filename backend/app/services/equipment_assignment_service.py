from sqlalchemy.orm import Session

from app.models.equipment_assignment import (
    EquipmentAssignment,
)

from app.schemas.equipment_assignment import (
    EquipmentAssignmentCreate,
    EquipmentAssignmentUpdate,
)

from app.repository.equipment_assignment_repository import (
    EquipmentAssignmentRepository,
)


class EquipmentAssignmentService:

    @staticmethod
    def assign_equipment(
        db: Session,
        request: EquipmentAssignmentCreate,
    ):
        equipment = (
            EquipmentAssignmentRepository.get_equipment_by_id(
                db,
                request.equipment_id,
            )
        )

        if equipment is None:
            return None

        if equipment.status != "Available":
            return False

        assignment = EquipmentAssignment(
            equipment_id=request.equipment_id,
            project_id=request.project_id,
            assigned_date=request.assigned_date,
            expected_return_date=request.expected_return_date,
            status="Assigned",
        )

        equipment.status = "In Use"

        EquipmentAssignmentRepository.update_equipment(
            db,
            equipment,
        )

        return EquipmentAssignmentRepository.create_assignment(
            db,
            assignment,
        )

    @staticmethod
    def get_all_assignments(
        db: Session,
    ):
        return (
            EquipmentAssignmentRepository.get_all_assignments(
                db,
            )
        )

    @staticmethod
    def update_assignment(
        db: Session,
        assignment_id: int,
        request: EquipmentAssignmentUpdate,
    ):
        assignment = (
            EquipmentAssignmentRepository.get_assignment_by_id(
                db,
                assignment_id,
            )
        )

        if assignment is None:
            return None

        assignment.expected_return_date = (
            request.expected_return_date
        )
        assignment.status = request.status

        return (
            EquipmentAssignmentRepository.update_assignment(
                db,
                assignment,
            )
        )
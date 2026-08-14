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

    # ==========================================================
    # ASSIGN EQUIPMENT
    # ==========================================================

    @staticmethod
    def assign_equipment(
        db: Session,
        request: EquipmentAssignmentCreate,
    ):

        equipment = (
            EquipmentAssignmentRepository
            .get_equipment_by_id(
                db,
                request.equipment_id,
            )
        )

        if equipment is None:
            return None

        # Equipment must be available
        if equipment.status != "Available":
            return False

        assignment = EquipmentAssignment(
            equipment_id=request.equipment_id,
            project_id=request.project_id,
            assigned_date=request.assigned_date,
            expected_return_date=request.expected_return_date,
            status="Assigned",
        )

        # Mark equipment as in use
        equipment.status = "In Use"

        EquipmentAssignmentRepository.update_equipment(
            db,
            equipment,
        )

        return (
            EquipmentAssignmentRepository
            .create_assignment(
                db,
                assignment,
            )
        )

    # ==========================================================
    # GET ALL ASSIGNMENTS
    # ==========================================================

    @staticmethod
    def get_all_assignments(
        db: Session,
    ):

        return (
            EquipmentAssignmentRepository
            .get_all_assignments(db)
        )

    # ==========================================================
    # GET ASSIGNMENT BY ID
    # ==========================================================

    @staticmethod
    def get_assignment_by_id(
        db: Session,
        assignment_id: int,
    ):

        return (
            EquipmentAssignmentRepository
            .get_assignment_by_id(
                db,
                assignment_id,
            )
        )

    # ==========================================================
    # UPDATE ASSIGNMENT
    # ==========================================================

    @staticmethod
    def update_assignment(
        db: Session,
        assignment_id: int,
        request: EquipmentAssignmentUpdate,
    ):

        assignment = (
            EquipmentAssignmentRepository
            .get_assignment_by_id(
                db,
                assignment_id,
            )
        )

        if assignment is None:
            return None

        # ======================================================
        # VALIDATE STATUS
        # ======================================================

        allowed_statuses = [
            "Assigned",
            "Returned",
            "Completed",
        ]

        if request.status not in allowed_statuses:
            raise ValueError(
                "Invalid assignment status. "
                "Allowed values: Assigned, Returned, Completed"
            )

        # ======================================================
        # UPDATE ASSIGNMENT
        # ======================================================

        assignment.expected_return_date = (
            request.expected_return_date
        )

        assignment.status = request.status

        # ======================================================
        # EQUIPMENT STATUS
        # ======================================================

        equipment = (
            EquipmentAssignmentRepository
            .get_equipment_by_id(
                db,
                assignment.equipment_id,
            )
        )

        if equipment is not None:

            if request.status in [
                "Returned",
                "Completed",
            ]:

                equipment.status = "Available"

            elif request.status == "Assigned":

                equipment.status = "In Use"

            EquipmentAssignmentRepository.update_equipment(
                db,
                equipment,
            )

        # ======================================================
        # SAVE ASSIGNMENT
        # ======================================================

        return (
            EquipmentAssignmentRepository
            .update_assignment(
                db,
                assignment,
            )
        )
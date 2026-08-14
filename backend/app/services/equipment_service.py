from sqlalchemy.orm import Session

from app.models.equipment import Equipment

from app.schemas.equipment import (
    EquipmentCreate,
    EquipmentUpdate,
)

from app.repository.equipment_repository import (
    EquipmentRepository,
)


class EquipmentService:

    # ==========================================================
    # CREATE EQUIPMENT
    # ==========================================================

    @staticmethod
    def create_equipment(
        db: Session,
        request: EquipmentCreate,
    ):

        equipment = Equipment(
            equipment_code=request.equipment_code,
            equipment_name=request.equipment_name,
            category=request.category,
            manufacturer=request.manufacturer,

            ownership_type=request.ownership_type,

            purchase_date=request.purchase_date,
            purchase_cost=request.purchase_cost,

            rental_rate=request.rental_rate,
            rental_rate_unit=request.rental_rate_unit,

            status="Available",
        )

        return EquipmentRepository.create_equipment(
            db,
            equipment,
        )

    # ==========================================================
    # GET ALL EQUIPMENT
    # ==========================================================

    @staticmethod
    def get_all_equipment(
        db: Session,
    ):

        return EquipmentRepository.get_all_equipment(
            db
        )

    # ==========================================================
    # GET EQUIPMENT BY ID
    # ==========================================================

    @staticmethod
    def get_equipment_by_id(
        db: Session,
        equipment_id: int,
    ):

        return EquipmentRepository.get_equipment_by_id(
            db,
            equipment_id,
        )

    # ==========================================================
    # UPDATE EQUIPMENT
    # ==========================================================

    @staticmethod
    def update_equipment(
        db: Session,
        equipment_id: int,
        request: EquipmentUpdate,
    ):

        equipment = (
            EquipmentRepository.get_equipment_by_id(
                db,
                equipment_id,
            )
        )

        if equipment is None:
            return None

        equipment.equipment_name = (
            request.equipment_name
        )

        equipment.category = (
            request.category
        )

        equipment.manufacturer = (
            request.manufacturer
        )

        equipment.ownership_type = (
            request.ownership_type
        )

        equipment.purchase_date = (
            request.purchase_date
        )

        equipment.purchase_cost = (
            request.purchase_cost
        )

        equipment.rental_rate = (
            request.rental_rate
        )

        equipment.rental_rate_unit = (
            request.rental_rate_unit
        )

        equipment.status = (
            request.status
        )

        return EquipmentRepository.update_equipment(
            db,
            equipment,
        )

    # ==========================================================
    # DELETE EQUIPMENT
    # ==========================================================

    @staticmethod
    def delete_equipment(
        db: Session,
        equipment_id: int,
    ):

        equipment = (
            EquipmentRepository.get_equipment_by_id(
                db,
                equipment_id,
            )
        )

        if equipment is None:
            return None

        EquipmentRepository.delete_equipment(
            db,
            equipment,
        )

        return True
from sqlalchemy.orm import Session

from app.models.material import Material
from app.schemas.material import (
    MaterialCreate,
    MaterialUpdate,
)
from app.repository.material_repository import MaterialRepository


class MaterialService:

    @staticmethod
    def create_material(
        db: Session,
        request: MaterialCreate,
    ):
        material = Material(
            material_code=request.material_code,
            material_name=request.material_name,
            category=request.category,
            unit=request.unit,
            quantity=request.quantity,
            unit_price=request.unit_price,
            supplier=request.supplier,
        )

        return MaterialRepository.create_material(
            db,
            material,
        )

    @staticmethod
    def get_all_materials(
        db: Session,
    ):
        return MaterialRepository.get_all_materials(db)

    @staticmethod
    def update_material(
        db: Session,
        material_id: int,
        request: MaterialUpdate,
    ):
        material = MaterialRepository.get_material_by_id(
            db,
            material_id,
        )

        if not material:
            return None

        material.material_name = request.material_name
        material.category = request.category
        material.unit = request.unit
        material.quantity = request.quantity
        material.unit_price = request.unit_price
        material.supplier = request.supplier

        return MaterialRepository.update_material(
            db,
            material,
        )

    @staticmethod
    def delete_material(
        db: Session,
        material_id: int,
    ):
        material = MaterialRepository.get_material_by_id(
            db,
            material_id,
        )

        if not material:
            return None

        MaterialRepository.delete_material(
            db,
            material,
        )

        return True
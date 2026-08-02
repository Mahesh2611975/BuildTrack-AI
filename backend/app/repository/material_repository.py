from sqlalchemy.orm import Session

from app.models.material import Material


class MaterialRepository:

    @staticmethod
    def create_material(
        db: Session,
        material: Material,
    ):
        db.add(material)
        db.commit()
        db.refresh(material)
        return material

    @staticmethod
    def get_all_materials(
        db: Session,
    ):
        return db.query(Material).all()

    @staticmethod
    def get_material_by_id(
        db: Session,
        material_id: int,
    ):
        return (
            db.query(Material)
            .filter(Material.id == material_id)
            .first()
        )

    @staticmethod
    def update_material(
        db: Session,
        material: Material,
    ):
        db.commit()
        db.refresh(material)
        return material

    @staticmethod
    def delete_material(
        db: Session,
        material: Material,
    ):
        db.delete(material)
        db.commit()
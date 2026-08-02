from sqlalchemy.orm import Session

from app.models.material import Material
from app.models.material_issue import MaterialIssue
from app.models.material_return import MaterialReturn


class MaterialReturnRepository:

    @staticmethod
    def get_issue_by_id(
        db: Session,
        issue_id: int,
    ):
        return (
            db.query(MaterialIssue)
            .filter(MaterialIssue.id == issue_id)
            .first()
        )

    @staticmethod
    def update_material(
        db: Session,
        material: Material,
    ):
        db.commit()
        db.refresh(material)

    @staticmethod
    def create_return(
        db: Session,
        material_return: MaterialReturn,
    ):
        db.add(material_return)
        db.commit()
        db.refresh(material_return)
        return material_return

    @staticmethod
    def get_all_returns(
        db: Session,
    ):
        return db.query(MaterialReturn).all()
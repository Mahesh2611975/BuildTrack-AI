from sqlalchemy.orm import Session

from app.models.material import Material
from app.models.material_issue import MaterialIssue


class MaterialIssueRepository:

    @staticmethod
    def issue_material(
        db: Session,
        issue: MaterialIssue,
    ):
        db.add(issue)
        db.commit()
        db.refresh(issue)
        return issue

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

    @staticmethod
    def get_all_issues(
        db: Session,
    ):
        return db.query(MaterialIssue).all()
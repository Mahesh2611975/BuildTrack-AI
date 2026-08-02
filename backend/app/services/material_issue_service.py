from sqlalchemy.orm import Session

from app.models.material_issue import MaterialIssue

from app.schemas.material_issue import MaterialIssueCreate

from app.repository.material_issue_repository import (
    MaterialIssueRepository,
)


class MaterialIssueService:

    @staticmethod
    def issue_material(
        db: Session,
        request: MaterialIssueCreate,
    ):
        material = MaterialIssueRepository.get_material_by_id(
            db,
            request.material_id,
        )

        if material is None:
            return None

        if material.quantity < request.quantity:
            return False

        material.quantity -= request.quantity

        MaterialIssueRepository.update_material(
            db,
            material,
        )

        issue = MaterialIssue(
            material_id=request.material_id,
            project_id=request.project_id,
            quantity=request.quantity,
            issue_date=request.issue_date,
            remarks=request.remarks,
        )

        return MaterialIssueRepository.issue_material(
            db,
            issue,
        )

    @staticmethod
    def get_all_issues(
        db: Session,
    ):
        return MaterialIssueRepository.get_all_issues(db)
from sqlalchemy.orm import Session

from app.models.material_return import MaterialReturn

from app.schemas.material_return import MaterialReturnCreate

from app.repository.material_return_repository import (
    MaterialReturnRepository,
)


class MaterialReturnService:

    @staticmethod
    def return_material(
        db: Session,
        request: MaterialReturnCreate,
    ):
        issue = MaterialReturnRepository.get_issue_by_id(
            db,
            request.material_issue_id,
        )

        if issue is None:
            return None

        if request.quantity > issue.quantity:
            return False

        material = issue.material
        material.quantity += request.quantity

        MaterialReturnRepository.update_material(
            db,
            material,
        )

        material_return = MaterialReturn(
            material_issue_id=request.material_issue_id,
            quantity=request.quantity,
            return_date=request.return_date,
            remarks=request.remarks,
        )

        return MaterialReturnRepository.create_return(
            db,
            material_return,
        )

    @staticmethod
    def get_all_returns(
        db: Session,
    ):
        return MaterialReturnRepository.get_all_returns(db)
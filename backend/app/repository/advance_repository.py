from sqlalchemy.orm import Session

from app.models.advance import Advance


class AdvanceRepository:

    @staticmethod
    def create_advance(
        db: Session,
        advance: Advance,
    ):
        db.add(advance)
        db.commit()
        db.refresh(advance)

        return advance


    @staticmethod
    def get_all_advances(
        db: Session,
    ):
        return (
            db.query(Advance)
            .all()
        )


    @staticmethod
    def get_advance_by_id(
        db: Session,
        advance_id: int,
    ):
        return (
            db.query(Advance)
            .filter(
                Advance.id == advance_id
            )
            .first()
        )


    @staticmethod
    def get_advances_by_employee(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(Advance)
            .filter(
                Advance.employee_id == employee_id
            )
            .all()
        )


    @staticmethod
    def update_advance(
        db: Session,
        advance: Advance,
    ):
        db.commit()
        db.refresh(advance)

        return advance


    @staticmethod
    def delete_advance(
        db: Session,
        advance: Advance,
    ):
        db.delete(advance)
        db.commit()
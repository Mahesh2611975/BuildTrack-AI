from sqlalchemy.orm import Session

from app.models.advance import Advance


class AdvanceRepository:

    # ==========================================================
    # CREATE MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def create_advance(
        db: Session,
        advance: Advance,
    ):

        db.add(advance)

        db.commit()

        db.refresh(advance)

        return advance

    # ==========================================================
    # GET ALL MAIN ADVANCES
    # ==========================================================

    @staticmethod
    def get_all_advances(
        db: Session,
    ):

        return (
            db.query(
                Advance
            )
            .order_by(
                Advance.id.desc()
            )
            .all()
        )

    # ==========================================================
    # GET MAIN ADVANCE BY ID
    # ==========================================================

    @staticmethod
    def get_advance_by_id(
        db: Session,
        advance_id: int,
    ):

        return (
            db.query(
                Advance
            )
            .filter(
                Advance.id == advance_id
            )
            .first()
        )

    # ==========================================================
    # GET MAIN ADVANCES BY EMPLOYEE
    # ==========================================================

    @staticmethod
    def get_advances_by_employee(
        db: Session,
        employee_id: int,
    ):

        return (
            db.query(
                Advance
            )
            .filter(
                Advance.employee_id
                == employee_id
            )
            .order_by(
                Advance.id.desc()
            )
            .all()
        )

    # ==========================================================
    # UPDATE MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def update_advance(
        db: Session,
        advance: Advance,
    ):

        db.commit()

        db.refresh(
            advance
        )

        return advance

    # ==========================================================
    # DELETE MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def delete_advance(
        db: Session,
        advance: Advance,
    ):

        db.delete(
            advance
        )

        db.commit()

        return True
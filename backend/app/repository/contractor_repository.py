from sqlalchemy.orm import Session

from app.models.contractor import Contractor
from app.schemas.contractor import (
    ContractorCreate,
    ContractorUpdate,
)


class ContractorRepository:

    # ==========================================
    # CREATE
    # ==========================================

    @staticmethod
    def create_contractor(
        db: Session,
        contractor: ContractorCreate,
    ):
        # Get latest contractor
        last_contractor = (
            db.query(Contractor)
            .order_by(Contractor.id.desc())
            .first()
        )

        # Generate Contractor ID
        if (
            last_contractor
            and last_contractor.contractor_id
        ):
            try:
                last_number = int(
                    last_contractor.contractor_id
                    .replace("CON", "")
                )
            except ValueError:
                last_number = last_contractor.id

            new_contractor_id = (
                f"CON{last_number + 1:03d}"
            )

        else:
            new_contractor_id = "CON001"

        # Convert Pydantic model to dictionary
        contractor_data = contractor.model_dump()

        # Add generated ID
        contractor_data["contractor_id"] = (
            new_contractor_id
        )

        # Create SQLAlchemy object
        db_contractor = Contractor(
            **contractor_data
        )

        db.add(db_contractor)
        db.commit()
        db.refresh(db_contractor)

        return db_contractor

    # ==========================================
    # GET ALL
    # ==========================================

    @staticmethod
    def get_all_contractors(
        db: Session,
    ):
        return (
            db.query(Contractor)
            .order_by(Contractor.id.asc())
            .all()
        )

    # ==========================================
    # GET BY ID
    # ==========================================

    @staticmethod
    def get_contractor_by_id(
        db: Session,
        contractor_id: int,
    ):
        return (
            db.query(Contractor)
            .filter(
                Contractor.id == contractor_id
            )
            .first()
        )

    # ==========================================
    # UPDATE
    # ==========================================

    @staticmethod
    def update_contractor(
        db: Session,
        contractor_id: int,
        contractor: ContractorUpdate,
    ):
        db_contractor = (
            db.query(Contractor)
            .filter(
                Contractor.id == contractor_id
            )
            .first()
        )

        if not db_contractor:
            return None

        update_data = contractor.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                db_contractor,
                key,
                value,
            )

        db.commit()
        db.refresh(db_contractor)

        return db_contractor

    # ==========================================
    # DELETE
    # ==========================================

    @staticmethod
    def delete_contractor(
        db: Session,
        contractor_id: int,
    ):
        db_contractor = (
            db.query(Contractor)
            .filter(
                Contractor.id == contractor_id
            )
            .first()
        )

        if not db_contractor:
            return None

        db.delete(db_contractor)
        db.commit()

        return db_contractor
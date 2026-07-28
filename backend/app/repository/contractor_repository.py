from sqlalchemy.orm import Session

from app.models.contractor import Contractor
from app.schemas.contractor import ContractorCreate, ContractorUpdate


class ContractorRepository:

    @staticmethod
    def create_contractor(db: Session, contractor: ContractorCreate):
        db_contractor = Contractor(**contractor.model_dump())
        db.add(db_contractor)
        db.commit()
        db.refresh(db_contractor)
        return db_contractor

    @staticmethod
    def get_all_contractors(db: Session):
        return db.query(Contractor).all()

    @staticmethod
    def get_contractor_by_id(db: Session, contractor_id: int):
        return db.query(Contractor).filter(
            Contractor.id == contractor_id
        ).first()

    @staticmethod
    def update_contractor(db: Session, contractor_id: int, contractor: ContractorUpdate):
        db_contractor = db.query(Contractor).filter(
            Contractor.id == contractor_id
        ).first()

        if not db_contractor:
            return None

        for key, value in contractor.model_dump().items():
            setattr(db_contractor, key, value)

        db.commit()
        db.refresh(db_contractor)

        return db_contractor

    @staticmethod
    def delete_contractor(db: Session, contractor_id: int):
        db_contractor = db.query(Contractor).filter(
            Contractor.id == contractor_id
        ).first()

        if not db_contractor:
            return None

        db.delete(db_contractor)
        db.commit()

        return db_contractor
from sqlalchemy.orm import Session

from app.repository.contractor_repository import ContractorRepository
from app.schemas.contractor import ContractorCreate, ContractorUpdate


class ContractorService:

    @staticmethod
    def create_contractor(db: Session, contractor: ContractorCreate):
        return ContractorRepository.create_contractor(db, contractor)

    @staticmethod
    def get_all_contractors(db: Session):
        return ContractorRepository.get_all_contractors(db)

    @staticmethod
    def get_contractor_by_id(db: Session, contractor_id: int):
        return ContractorRepository.get_contractor_by_id(db, contractor_id)

    @staticmethod
    def update_contractor(db: Session, contractor_id: int, contractor: ContractorUpdate):
        return ContractorRepository.update_contractor(
            db,
            contractor_id,
            contractor,
        )

    @staticmethod
    def delete_contractor(db: Session, contractor_id: int):
        return ContractorRepository.delete_contractor(
            db,
            contractor_id,
        )
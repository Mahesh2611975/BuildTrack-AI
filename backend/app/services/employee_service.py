from sqlalchemy.orm import Session

from app.repository.employee_repository import EmployeeRepository
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeService:

    @staticmethod
    def create_employee(db: Session, employee: EmployeeCreate):
        return EmployeeRepository.create_employee(db, employee)

    @staticmethod
    def get_all_employees(db: Session):
        return EmployeeRepository.get_all_employees(db)

    @staticmethod
    def get_employee_by_id(db: Session, employee_id: int):
        return EmployeeRepository.get_employee_by_id(db, employee_id)

    @staticmethod
    def update_employee(
        db: Session,
        employee_id: int,
        employee: EmployeeUpdate,
    ):
        return EmployeeRepository.update_employee(
            db,
            employee_id,
            employee,
        )

    @staticmethod
    def delete_employee(db: Session, employee_id: int):
        return EmployeeRepository.delete_employee(db, employee_id)
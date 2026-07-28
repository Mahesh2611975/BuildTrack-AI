from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeRepository:

    @staticmethod
    def create_employee(db: Session, employee: EmployeeCreate):
        db_employee = Employee(**employee.model_dump())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee

    @staticmethod
    def get_all_employees(db: Session):
        return db.query(Employee).all()

    @staticmethod
    def get_employee_by_id(db: Session, employee_id: int):
        return db.query(Employee).filter(Employee.id == employee_id).first()

    @staticmethod
    def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate):
        db_employee = db.query(Employee).filter(Employee.id == employee_id).first()

        if not db_employee:
            return None

        update_data = employee.model_dump()

        for key, value in update_data.items():
            setattr(db_employee, key, value)

        db.commit()
        db.refresh(db_employee)

        return db_employee

    @staticmethod
    def delete_employee(db: Session, employee_id: int):
        db_employee = db.query(Employee).filter(Employee.id == employee_id).first()

        if not db_employee:
            return None

        db.delete(db_employee)
        db.commit()

        return db_employee
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeRepository:

    @staticmethod
    def create_employee(db: Session, employee: EmployeeCreate):
        # Get the latest employee
        last_employee = (
            db.query(Employee)
            .order_by(Employee.id.desc())
            .first()
        )

        # Generate Employee ID
        if last_employee and last_employee.employee_id:
            try:
                last_number = int(last_employee.employee_id.replace("EMP", ""))
            except ValueError:
                last_number = last_employee.id

            new_employee_id = f"EMP{last_number + 1:03d}"
        else:
            new_employee_id = "EMP001"

        # Create Employee
        db_employee = Employee(
            employee_id=new_employee_id,
            full_name=employee.full_name,
            mobile_number=employee.mobile_number,
            email=employee.email,
            designation=employee.designation,
            department=employee.department,
            salary=employee.salary,
            joining_date=employee.joining_date,
            is_active=employee.is_active,
        )

        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)

        return db_employee

    @staticmethod
    def get_all_employees(db: Session):
        return db.query(Employee).all()

    @staticmethod
    def get_employee_by_id(db: Session, employee_id: int):
        return (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

    @staticmethod
    def update_employee(
        db: Session,
        employee_id: int,
        employee: EmployeeUpdate,
    ):
        db_employee = (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

        if not db_employee:
            return None

        update_data = employee.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_employee, key, value)

        db.commit()
        db.refresh(db_employee)

        return db_employee

    @staticmethod
    def delete_employee(db: Session, employee_id: int):
        db_employee = (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

        if not db_employee:
            return None

        db.delete(db_employee)
        db.commit()

        return db_employee
from sqlalchemy.orm import Session

from app.repository.employee_repository import (
    EmployeeRepository,
)

from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
)


class EmployeeService:

    # ==========================================
    # CREATE
    # ==========================================

    @staticmethod
    def create_employee(
        db: Session,
        employee: EmployeeCreate,
    ):

        # Check mobile number
        existing_mobile = (
            EmployeeRepository.get_by_mobile(
                db,
                employee.mobile_number,
            )
        )

        if existing_mobile:
            raise ValueError(
                "Mobile number already exists"
            )

        # Check email
        existing_email = (
            EmployeeRepository.get_by_email(
                db,
                employee.email,
            )
        )

        if existing_email:
            raise ValueError(
                "Email already exists"
            )

        return EmployeeRepository.create_employee(
            db,
            employee,
        )

    # ==========================================
    # GET ALL
    # ==========================================

    @staticmethod
    def get_all_employees(
        db: Session,
    ):
        return EmployeeRepository.get_all_employees(
            db
        )

    # ==========================================
    # GET BY ID
    # ==========================================

    @staticmethod
    def get_employee_by_id(
        db: Session,
        employee_id: int,
    ):
        return EmployeeRepository.get_employee_by_id(
            db,
            employee_id,
        )

    # ==========================================
    # UPDATE
    # ==========================================

    @staticmethod
    def update_employee(
        db: Session,
        employee_id: int,
        employee: EmployeeUpdate,
    ):

        # Check employee exists
        existing_employee = (
            EmployeeRepository.get_employee_by_id(
                db,
                employee_id,
            )
        )

        if not existing_employee:
            return None

        # Check mobile belongs to another employee
        existing_mobile = (
            EmployeeRepository.get_by_mobile(
                db,
                employee.mobile_number,
            )
        )

        if (
            existing_mobile
            and existing_mobile.id != employee_id
        ):
            raise ValueError(
                "Mobile number already exists"
            )

        # Check email belongs to another employee
        existing_email = (
            EmployeeRepository.get_by_email(
                db,
                employee.email,
            )
        )

        if (
            existing_email
            and existing_email.id != employee_id
        ):
            raise ValueError(
                "Email already exists"
            )

        return EmployeeRepository.update_employee(
            db,
            employee_id,
            employee,
        )

    # ==========================================
    # DELETE
    # ==========================================

    @staticmethod
    def delete_employee(
        db: Session,
        employee_id: int,
    ):
        return EmployeeRepository.delete_employee(
            db,
            employee_id,
        )
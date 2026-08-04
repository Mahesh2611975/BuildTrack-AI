from calendar import monthrange
from sqlalchemy.orm import Session

from app.repository.employee_repository import EmployeeRepository
from app.repository.salary_structure_repository import (
    SalaryStructureRepository,
)
from app.repository.attendance_repository import (
    AttendanceRepository,
)

from app.payroll.payroll_calculator import (
    PayrollCalculator,
)


class PayrollService:

    @staticmethod
    def generate_payroll(
        db: Session,
        employee_id: int,
        year: int,
        month: int,
    ):
        employee = EmployeeRepository.get_employee_by_id(
            db,
            employee_id,
        )

        if employee is None:
            return None

        salary = (
            SalaryStructureRepository.get_salary_by_employee(
                db,
                employee_id,
            )
        )

        if salary is None:
            return "salary_not_found"

        present_days = (
            AttendanceRepository.count_present_days(
                db,
                employee_id,
                year,
                month,
            )
        )

        total_working_days = monthrange(
            year,
            month,
        )[1]

        payroll = PayrollCalculator.calculate(
            salary,
            present_days,
            total_working_days,
        )

        payroll["employee_name"] = employee.full_name
        payroll["employee_id"] = employee.employee_id
        payroll["month"] = month
        payroll["year"] = year

        return payroll
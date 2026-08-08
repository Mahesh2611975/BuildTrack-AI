from calendar import monthrange

from sqlalchemy.orm import Session

from app.repository.employee_repository import (
    EmployeeRepository,
)

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

        # =================================================
        # VALIDATE MONTH
        # =================================================

        if month < 1 or month > 12:
            return "invalid_month"

        # =================================================
        # GET EMPLOYEE
        # =================================================

        employee = (
            EmployeeRepository.get_employee_by_id(
                db,
                employee_id,
            )
        )

        if employee is None:
            return None

        # =================================================
        # GET SALARY STRUCTURE
        # =================================================

        salary = (
            SalaryStructureRepository
            .get_salary_by_employee(
                db,
                employee_id,
            )
        )

        if salary is None:
            return "salary_not_found"

        # =================================================
        # GET ATTENDANCE SUMMARY
        # =================================================

        attendance = (
            AttendanceRepository
            .get_monthly_attendance_summary(
                db,
                employee_id,
                year,
                month,
            )
        )

        present_days = attendance[
            "present_days"
        ]

        half_days = attendance[
            "half_days"
        ]

        absent_days = attendance[
            "absent_days"
        ]

        leave_days = attendance[
            "leave_days"
        ]

        # =================================================
        # TOTAL DAYS IN MONTH
        # =================================================

        total_working_days = monthrange(
            year,
            month,
        )[1]

        # =================================================
        # CALCULATE PAYROLL
        # =================================================

        payroll = PayrollCalculator.calculate(
            salary_structure=salary,

            present_days=present_days,

            half_days=half_days,

            absent_days=absent_days,

            leave_days=leave_days,

            total_working_days=total_working_days,
        )

        # =================================================
        # EMPLOYEE INFORMATION
        # =================================================

        payroll["employee_name"] = (
            employee.full_name
        )

        payroll["employee_id"] = (
            employee.employee_id
        )

        payroll["month"] = month

        payroll["year"] = year

        # =================================================
        # RETURN
        # =================================================

        return payroll
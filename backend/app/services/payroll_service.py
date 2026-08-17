from calendar import monthrange
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.advance import Advance
from app.models.payroll import Payroll

from app.repository.employee_repository import (
    EmployeeRepository,
)

from app.repository.salary_structure_repository import (
    SalaryStructureRepository,
)

from app.repository.attendance_repository import (
    AttendanceRepository,
)

from app.repository.payroll_repository import (
    PayrollRepository,
)

from app.payroll.payroll_calculator import (
    PayrollCalculator,
)


class PayrollService:

    # =====================================================
    # GENERATE PAYROLL
    # =====================================================

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
            raise ValueError(
                "Month must be between 1 and 12"
            )

        # =================================================
        # VALIDATE YEAR
        # =================================================

        if year < 2000 or year > 2100:
            raise ValueError(
                "Year must be between 2000 and 2100"
            )

        # =================================================
        # FIND EMPLOYEE
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
        # FIND SALARY STRUCTURE
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
        # GET MONTHLY ATTENDANCE
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

        present_days = attendance["present_days"]

        half_days = attendance["half_days"]

        absent_days = attendance["absent_days"]

        leave_days = attendance["leave_days"]

        # =================================================
        # TOTAL DAYS IN MONTH
        # =================================================

        total_working_days = monthrange(
            year,
            month,
        )[1]

        # =================================================
        # CALCULATE BASIC PAYROLL
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
        # NORMAL DEDUCTIONS
        # =================================================

        normal_deductions = (
            float(payroll["pf"] or 0)
            + float(payroll["professional_tax"] or 0)
        )

        earned_salary = float(
            payroll["earned_salary"] or 0
        )

        # =================================================
        # AVAILABLE SALARY FOR ADVANCE DEDUCTION
        # =================================================

        available_for_advance = max(
            earned_salary - normal_deductions,
            0,
        )

        # =================================================
        # GET APPROVED ADVANCE BALANCE
        #
        # Only advances having remaining_amount > 0
        # are considered.
        # =================================================

        approved_advances = (
            db.query(Advance)
            .filter(
                Advance.employee_id == employee_id,
                Advance.status.in_(
                    [
                        "Approved",
                        "Partially Paid",
                    ]
                ),
                Advance.remaining_amount > 0,
            )
            .order_by(
                Advance.advance_date.asc(),
                Advance.id.asc(),
            )
            .all()
        )

        # =================================================
        # CALCULATE ADVANCE DEDUCTION
        #
        # Never allow advance deduction to make
        # net salary negative.
        # =================================================

        advance_deduction = 0.0

        remaining_available_salary = (
            available_for_advance
        )

        # Total approved advance balance
        total_advance_balance = sum(
            float(advance.remaining_amount or 0)
            for advance in approved_advances
        )
        total_advance_taken = sum(
            float(advance.amount or 0)
            for advance in approved_advances
        )
        for advance in approved_advances:

            if remaining_available_salary <= 0:
                break

            advance_remaining = float(
                advance.remaining_amount or 0
            )

            deduction = min(
                advance_remaining,
                remaining_available_salary,
            )

            advance_deduction += deduction

            remaining_available_salary -= deduction


        # Remaining advance balance after this month's deduction
        advance_remaining_total = max(
            total_advance_balance - advance_deduction,
            0,
        )

        # =================================================
        # TOTAL DEDUCTIONS
        # =================================================

        payroll["advance_deduction"] = round(
            advance_deduction,
            2,
        )
        payroll["advance_remaining"] = round(
            advance_remaining_total,
            2,
        )
        payroll["advance_taken"] = round(
            total_advance_taken,
            2,
        )
        payroll["total_deductions"] = round(
            normal_deductions
            + advance_deduction,
            2,
        )

        # =================================================
        # NET SALARY
        # =================================================

        payroll["net_salary"] = round(
            max(
                earned_salary
                - payroll["total_deductions"],
                0,
            ),
            2,
        )

        # =================================================
        # EMPLOYEE INFORMATION
        # =================================================

        payroll["employee_name"] = (
            employee.full_name
        )

        # Example:
        # EMP001
        payroll["employee_id"] = (
            employee.employee_id
        )

        # Actual database ID
        payroll["employee_db_id"] = (
            employee.id
        )

        payroll["month"] = month

        payroll["year"] = year

        return payroll

    # =====================================================
    # SAVE PAYROLL
    # =====================================================

    @staticmethod
    def save_payroll(
        db: Session,
        payroll_data: dict,
    ):

        employee_id = payroll_data[
            "employee_db_id"
        ]

        year = payroll_data[
            "year"
        ]

        month = payroll_data[
            "month"
        ]

        # =================================================
        # CHECK EXISTING PAYROLL
        # =================================================

        existing_payroll = (
            PayrollRepository
            .get_monthly_payroll(
                db,
                employee_id,
                year,
                month,
            )
        )

        # =================================================
        # UPDATE EXISTING PAYROLL
        # =================================================

        if existing_payroll:

            existing_payroll.employee_name = (
                payroll_data["employee_name"]
            )

            existing_payroll.employee_code = (
                payroll_data["employee_id"]
            )

            existing_payroll.month = month

            existing_payroll.year = year

            existing_payroll.total_working_days = (
                payroll_data[
                    "total_working_days"
                ]
            )

            existing_payroll.present_days = (
                payroll_data[
                    "present_days"
                ]
            )

            existing_payroll.half_days = (
                payroll_data[
                    "half_days"
                ]
            )

            existing_payroll.absent_days = (
                payroll_data[
                    "absent_days"
                ]
            )

            existing_payroll.leave_days = (
                payroll_data[
                    "leave_days"
                ]
            )

            existing_payroll.paid_days = (
                payroll_data[
                    "paid_days"
                ]
            )

            existing_payroll.basic_salary = (
                payroll_data[
                    "basic_salary"
                ]
            )

            existing_payroll.hra = (
                payroll_data[
                    "hra"
                ]
            )

            existing_payroll.allowance = (
                payroll_data[
                    "allowance"
                ]
            )

            existing_payroll.gross_salary = (
                payroll_data[
                    "gross_salary"
                ]
            )

            existing_payroll.daily_salary = (
                payroll_data[
                    "daily_salary"
                ]
            )

            existing_payroll.earned_salary = (
                payroll_data[
                    "earned_salary"
                ]
            )

            existing_payroll.pf = (
                payroll_data["pf"]
            )

            existing_payroll.professional_tax = (
                payroll_data[
                    "professional_tax"
                ]
            )

            existing_payroll.total_deductions = (
                payroll_data[
                    "total_deductions"
                ]
            )

            existing_payroll.net_salary = (
                payroll_data[
                    "net_salary"
                ]
            )

            db.commit()

            db.refresh(
                existing_payroll
            )

            return existing_payroll

        # =================================================
        # CREATE NEW PAYROLL
        # =================================================

        payroll = Payroll(

            employee_id=employee_id,

            employee_name=(
                payroll_data[
                    "employee_name"
                ]
            ),

            employee_code=(
                payroll_data[
                    "employee_id"
                ]
            ),

            month=month,

            year=year,

            total_working_days=(
                payroll_data[
                    "total_working_days"
                ]
            ),

            present_days=(
                payroll_data[
                    "present_days"
                ]
            ),

            half_days=(
                payroll_data[
                    "half_days"
                ]
            ),

            absent_days=(
                payroll_data[
                    "absent_days"
                ]
            ),

            leave_days=(
                payroll_data[
                    "leave_days"
                ]
            ),

            paid_days=(
                payroll_data[
                    "paid_days"
                ]
            ),

            basic_salary=(
                payroll_data[
                    "basic_salary"
                ]
            ),

            hra=(
                payroll_data["hra"]
            ),

            allowance=(
                payroll_data[
                    "allowance"
                ]
            ),

            gross_salary=(
                payroll_data[
                    "gross_salary"
                ]
            ),

            daily_salary=(
                payroll_data[
                    "daily_salary"
                ]
            ),

            earned_salary=(
                payroll_data[
                    "earned_salary"
                ]
            ),

            pf=(
                payroll_data["pf"]
            ),

            professional_tax=(
                payroll_data[
                    "professional_tax"
                ]
            ),

            total_deductions=(
                payroll_data[
                    "total_deductions"
                ]
            ),

            net_salary=(
                payroll_data[
                    "net_salary"
                ]
            ),
        )

        saved_payroll = (
            PayrollRepository
            .create_payroll(
                db,
                payroll,
            )
        )

        # =================================================
        # UPDATE ADVANCE BALANCES
        # =================================================

        advance_to_deduct = float(
            payroll_data.get(
                "advance_deduction",
                0,
            )
        )

        if advance_to_deduct > 0:

            approved_advances = (
                db.query(Advance)
                .filter(
                    Advance.employee_id
                    == employee_id,

                    Advance.status.in_(
                        [
                            "Approved",
                            "Partially Paid",
                        ]
                    ),

                    Advance.remaining_amount
                    > 0,
                )
                .order_by(
                    Advance.advance_date.asc(),
                    Advance.id.asc(),
                )
                .all()
            )

            remaining_deduction = (
                advance_to_deduct
            )

            for advance in approved_advances:

                if remaining_deduction <= 0:
                    break

                current_balance = float(
                    advance.remaining_amount
                    or 0
                )

                deduction = min(
                    current_balance,
                    remaining_deduction,
                )

                advance.remaining_amount = round(
                    current_balance - deduction,
                    2,
                )

                if (
                    advance.remaining_amount
                    <= 0
                ):
                    advance.remaining_amount = 0

                    advance.status = "Paid"

                else:
                    advance.status = (
                        "Partially Paid"
                    )

                remaining_deduction -= deduction

        db.commit()

        db.refresh(
            saved_payroll
        )

        return saved_payroll

    # =====================================================
    # GET ALL PAYROLL HISTORY
    # =====================================================

    @staticmethod
    def get_all_payroll(
        db: Session,
    ):

        return (
            PayrollRepository
            .get_all_payroll(
                db
            )
        )

    # =====================================================
    # GET PAYROLL BY ID
    # =====================================================

    @staticmethod
    def get_payroll_by_id(
        db: Session,
        payroll_id: int,
    ):

        return (
            PayrollRepository
            .get_payroll_by_id(
                db,
                payroll_id,
            )
        )

    # =====================================================
    # GET EMPLOYEE PAYROLL HISTORY
    # =====================================================

    @staticmethod
    def get_employee_payroll(
        db: Session,
        employee_id: int,
    ):

        return (
            PayrollRepository
            .get_employee_payroll(
                db,
                employee_id,
            )
        )

    # =====================================================
    # DELETE PAYROLL
    # =====================================================

    @staticmethod
    def delete_payroll(
        db: Session,
        payroll_id: int,
    ):

        return (
            PayrollRepository
            .delete_payroll(
                db,
                payroll_id,
            )
        )
from calendar import monthrange
from datetime import date

from sqlalchemy.orm import Session

from app.models.advance import Advance
from app.models.advance_transaction import AdvanceTransaction
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

    # ==========================================================
    # GENERATE PAYROLL
    # ==========================================================

    @staticmethod
    def generate_payroll(
        db: Session,
        employee_id: int,
        year: int,
        month: int,
    ):

        # ======================================================
        # VALIDATE MONTH
        # ======================================================

        if month < 1 or month > 12:
            raise ValueError(
                "Month must be between 1 and 12"
            )

        # ======================================================
        # VALIDATE YEAR
        # ======================================================

        if year < 2000 or year > 2100:
            raise ValueError(
                "Year must be between 2000 and 2100"
            )

        # ======================================================
        # FIND EMPLOYEE
        # ======================================================

        employee = (
            EmployeeRepository.get_employee_by_id(
                db,
                employee_id,
            )
        )

        if employee is None:
            return None

        # ======================================================
        # FIND SALARY STRUCTURE
        # ======================================================

        salary = (
            SalaryStructureRepository
            .get_salary_by_employee(
                db,
                employee_id,
            )
        )

        if salary is None:
            return "salary_not_found"

        # ======================================================
        # GET MONTHLY ATTENDANCE
        # ======================================================

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

        # ======================================================
        # TOTAL DAYS IN MONTH
        # ======================================================

        total_working_days = monthrange(
            year,
            month,
        )[1]

        # ======================================================
        # BASIC PAYROLL CALCULATION
        # ======================================================

        payroll = PayrollCalculator.calculate(
            salary_structure=salary,
            present_days=present_days,
            half_days=half_days,
            absent_days=absent_days,
            leave_days=leave_days,
            total_working_days=total_working_days,
        )

        # ======================================================
        # EARNED SALARY
        # ======================================================

        earned_salary = round(
            float(
                payroll.get(
                    "earned_salary",
                    0,
                )
                or 0
            ),
            2,
        )

        # ======================================================
        # NORMAL DEDUCTIONS
        # ======================================================

        pf = round(
            float(
                payroll.get(
                    "pf",
                    0,
                )
                or 0
            ),
            2,
        )

        professional_tax = round(
            float(
                payroll.get(
                    "professional_tax",
                    0,
                )
                or 0
            ),
            2,
        )

        normal_deductions = round(
            pf + professional_tax,
            2,
        )

        # ======================================================
        # MONTH DATE RANGE
        # ======================================================

        month_start = date(
            year,
            month,
            1,
        )

        if month == 12:

            next_month_start = date(
                year + 1,
                1,
                1,
            )

        else:

            next_month_start = date(
                year,
                month + 1,
                1,
            )

        # ======================================================
        # GET DAILY ADVANCE TRANSACTIONS
        #
        # IMPORTANT:
        #
        # These are separate from the main employee advance.
        #
        # Example:
        #
        # Aug 17 -> ₹200 Food
        # Aug 18 -> ₹300 Travel
        # Aug 19 -> ₹500 Food
        #
        # Total = ₹1,000
        # ======================================================

        daily_transactions = (
            db.query(
                AdvanceTransaction
            )
            .filter(
                AdvanceTransaction.employee_id
                == employee_id,

                AdvanceTransaction.transaction_date
                >= month_start,

                AdvanceTransaction.transaction_date
                < next_month_start,
            )
            .order_by(
                AdvanceTransaction.transaction_date.asc(),
                AdvanceTransaction.id.asc(),
            )
            .all()
        )

        # ======================================================
        # TOTAL DAILY ADVANCE TAKEN
        # ======================================================

        advance_taken = round(
            sum(
                float(
                    transaction.amount or 0
                )
                for transaction
                in daily_transactions
            ),
            2,
        )

        # ======================================================
        # AVAILABLE SALARY AFTER NORMAL DEDUCTIONS
        #
        # Example:
        #
        # Earned salary       ₹8,000
        # PF + PT              ₹100
        #
        # Available salary    ₹7,900
        # ======================================================

        available_salary = max(
            earned_salary
            - normal_deductions,
            0,
        )

        # ======================================================
        # DAILY ADVANCE DEDUCTION
        #
        # Daily advance is money already received
        # by the employee.
        #
        # Therefore it is deducted from this month's
        # salary exactly once.
        # ======================================================

        advance_deduction = min(
            advance_taken,
            available_salary,
        )

        advance_deduction = round(
            advance_deduction,
            2,
        )

        # ======================================================
        # FIND MAIN ADVANCE
        #
        # IMPORTANT:
        #
        # Main advance is completely separate from
        # daily transactions.
        #
        # We ONLY DISPLAY it here.
        #
        # We DO NOT subtract daily advances from it.
        # ======================================================

        main_advance = (
            db.query(
                Advance
            )
            .filter(
                Advance.employee_id
                == employee_id,

                Advance.status.in_(
                    [
                        "Pending",
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
            .first()
        )

        # ======================================================
        # MAIN ADVANCE DETAILS
        # ======================================================

        if main_advance:

            main_advance_amount = round(
                float(
                    main_advance.amount
                    or 0
                ),
                2,
            )

            advance_remaining = round(
                float(
                    main_advance.remaining_amount
                    or 0
                ),
                2,
            )

        else:

            main_advance_amount = 0.0
            advance_remaining = 0.0

        # ======================================================
        # TOTAL DEDUCTIONS
        # ======================================================

        total_deductions = round(
            normal_deductions
            + advance_deduction,
            2,
        )

        # ======================================================
        # NET SALARY
        # ======================================================

        net_salary = round(
            max(
                earned_salary
                - total_deductions,
                0,
            ),
            2,
        )

        # ======================================================
        # ADD ADVANCE INFORMATION
        # ======================================================

        payroll["main_advance_amount"] = (
            main_advance_amount
        )

        payroll["advance_taken"] = (
            advance_taken
        )

        payroll["advance_deduction"] = (
            advance_deduction
        )

        payroll["advance_remaining"] = (
            advance_remaining
        )

        payroll["total_deductions"] = (
            total_deductions
        )

        payroll["net_salary"] = (
            net_salary
        )

        # ======================================================
        # EMPLOYEE INFORMATION
        # ======================================================

        payroll["employee_name"] = (
            employee.full_name
        )

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

    # ==========================================================
    # SAVE PAYROLL
    # ==========================================================

    @staticmethod
    def save_payroll(
        db: Session,
        payroll_data: dict,
    ):

        employee_id = (
            payroll_data[
                "employee_db_id"
            ]
        )

        year = payroll_data["year"]
        month = payroll_data["month"]

        # ======================================================
        # CHECK EXISTING PAYROLL
        # ======================================================

        existing_payroll = (
            PayrollRepository
            .get_monthly_payroll(
                db,
                employee_id,
                year,
                month,
            )
        )

        # ======================================================
        # UPDATE EXISTING PAYROLL
        # ======================================================

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

            # ==================================================
            # ADVANCE INFORMATION
            # ==================================================

            existing_payroll.main_advance_amount = (
                payroll_data[
                    "main_advance_amount"
                ]
            )

            existing_payroll.advance_taken = (
                payroll_data[
                    "advance_taken"
                ]
            )

            existing_payroll.advance_deduction = (
                payroll_data[
                    "advance_deduction"
                ]
            )

            existing_payroll.advance_remaining = (
                payroll_data[
                    "advance_remaining"
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

        # ======================================================
        # CREATE NEW PAYROLL
        # ======================================================

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
                payroll_data[
                    "hra"
                ]
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

            # ==================================================
            # ADVANCE INFORMATION
            # ==================================================

            main_advance_amount=(
                payroll_data[
                    "main_advance_amount"
                ]
            ),

            advance_taken=(
                payroll_data[
                    "advance_taken"
                ]
            ),

            advance_deduction=(
                payroll_data[
                    "advance_deduction"
                ]
            ),

            advance_remaining=(
                payroll_data[
                    "advance_remaining"
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

        # ======================================================
        # SAVE
        # ======================================================

        saved_payroll = (
            PayrollRepository
            .create_payroll(
                db,
                payroll,
            )
        )

        db.commit()

        db.refresh(
            saved_payroll
        )

        return saved_payroll

    # ==========================================================
    # GET ALL PAYROLL
    # ==========================================================

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

    # ==========================================================
    # GET PAYROLL BY ID
    # ==========================================================

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

    # ==========================================================
    # GET EMPLOYEE PAYROLL HISTORY
    # ==========================================================

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

    # ==========================================================
    # DELETE PAYROLL
    # ==========================================================

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
from calendar import monthrange
from datetime import date, datetime, timezone

from sqlalchemy import func
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
    # INTERNAL HELPER
    # ==========================================================

    @staticmethod
    def _get_recovery_transactions(
        db: Session,
        employee_id: int,
        start_date=None,
        end_date=None,
    ):
        """
        Get salary-advance recovery transactions.

        Daily advances are excluded.
        Only transactions linked to a main Advance are included.
        """

        query = (
            db.query(AdvanceTransaction)
            .filter(
                AdvanceTransaction.employee_id == employee_id,
                AdvanceTransaction.advance_id.isnot(None),
                AdvanceTransaction.reason.isnot(None),
                ~AdvanceTransaction.reason.ilike(
                    "%daily advance%"
                ),
            )
        )

        if start_date is not None:
            query = query.filter(
                AdvanceTransaction.transaction_date >= start_date
            )

        if end_date is not None:
            query = query.filter(
                AdvanceTransaction.transaction_date < end_date
            )

        return (
            query
            .order_by(
                AdvanceTransaction.transaction_date.asc(),
                AdvanceTransaction.id.asc(),
            )
            .all()
        )

    # ==========================================================
    # INTERNAL HELPER
    # ==========================================================

    @staticmethod
    def _get_main_advance(
        db: Session,
        employee_id: int,
        recovery_transactions=None,
    ):
        """
        Find the employee's main salary advance.

        Priority:
        1. Advance linked to current recovery transaction.
        2. Otherwise oldest active advance.
        """

        main_advance = None

        # ------------------------------------------------------
        # FIRST: ADVANCE LINKED TO RECOVERY TRANSACTION
        # ------------------------------------------------------

        if recovery_transactions:

            advance_ids = [
                transaction.advance_id
                for transaction in recovery_transactions
                if transaction.advance_id is not None
            ]

            if advance_ids:

                main_advance = (
                    db.query(Advance)
                    .filter(
                        Advance.id.in_(advance_ids),
                        Advance.employee_id == employee_id,
                    )
                    .order_by(
                        Advance.advance_date.asc(),
                        Advance.id.asc(),
                    )
                    .first()
                )

        # ------------------------------------------------------
        # SECOND: FIND ACTIVE ADVANCE
        # ------------------------------------------------------

        if main_advance is None:

            main_advance = (
                db.query(Advance)
                .filter(
                    Advance.employee_id == employee_id,

                    func.lower(
                        Advance.status
                    ).in_(
                        [
                            "pending",
                            "approved",
                            "approve",
                            "partially paid",
                        ]
                    ),

                    Advance.remaining_amount > 0,
                )
                .order_by(
                    Advance.advance_date.asc(),
                    Advance.id.asc(),
                )
                .first()
            )

        return main_advance

    # ==========================================================
    # INTERNAL HELPER
    # ==========================================================

    @staticmethod
    def _calculate_advance_remaining(
        db: Session,
        advance: Advance,
    ):
        """
        Calculate the real remaining advance.

        Formula:

            Original Advance
            -
            All salary advance recovery transactions
            =
            Remaining Advance

        Daily advances are ignored.
        """

        if advance is None:
            return 0.0

        original_amount = round(
            float(advance.amount or 0),
            2,
        )

        transactions = (
            db.query(AdvanceTransaction)
            .filter(
                AdvanceTransaction.advance_id == advance.id,
                AdvanceTransaction.employee_id
                == advance.employee_id,
                AdvanceTransaction.reason.isnot(None),
                ~AdvanceTransaction.reason.ilike(
                    "%daily advance%"
                ),
            )
            .all()
        )

        total_recovered = round(
            sum(
                float(transaction.amount or 0)
                for transaction in transactions
            ),
            2,
        )

        remaining = round(
            max(
                original_amount
                - total_recovered,
                0,
            ),
            2,
        )

        return remaining

    # ==========================================================
    # INTERNAL HELPER
    # ==========================================================

    @staticmethod
    def _sync_advance_balance(
        db: Session,
        advance: Advance,
    ):
        """
        Synchronize Advance.remaining_amount and status
        with the actual recovery transactions.
        """

        if advance is None:
            return 0.0

        original_amount = round(
            float(advance.amount or 0),
            2,
        )

        remaining = (
            PayrollService
            ._calculate_advance_remaining(
                db,
                advance,
            )
        )

        advance.remaining_amount = remaining

        # ------------------------------------------------------
        # UPDATE STATUS
        # ------------------------------------------------------

        if remaining <= 0:

            advance.remaining_amount = 0.0
            advance.status = "Paid"

        elif remaining < original_amount:

            advance.status = "Partially Paid"

        else:

            # Keep approved state if it already exists.
            current_status = str(
                advance.status or ""
            ).lower()

            if current_status in (
                "",
                "pending",
                "approve",
                "approved",
            ):
                advance.status = "Approved"

        return remaining

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
            SalaryStructureRepository.get_salary_by_employee(
                db,
                employee_id,
            )
        )

        if salary is None:
            return "salary_not_found"

        # ======================================================
        # GET ATTENDANCE
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
        # TOTAL DAYS
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
        # PF
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

        # ======================================================
        # PROFESSIONAL TAX
        # ======================================================

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

        # ======================================================
        # NORMAL DEDUCTIONS
        # ======================================================

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
        # CURRENT MONTH RECOVERY TRANSACTIONS
        # ======================================================

        recovery_transactions = (
            PayrollService
            ._get_recovery_transactions(
                db,
                employee_id,
                month_start,
                next_month_start,
            )
        )

        # ======================================================
        # CURRENT MONTH RECOVERY
        # ======================================================

        advance_taken = round(
            sum(
                float(transaction.amount or 0)
                for transaction
                in recovery_transactions
            ),
            2,
        )

        # ======================================================
        # FIND MAIN ADVANCE
        # ======================================================

        main_advance = (
            PayrollService
            ._get_main_advance(
                db,
                employee_id,
                recovery_transactions,
            )
        )

        # ======================================================
        # CALCULATE REAL REMAINING ADVANCE
        # ======================================================

        if main_advance:

            main_advance_amount = round(
                float(
                    main_advance.amount or 0
                ),
                2,
            )

            # IMPORTANT:
            # Do NOT change the database here.
            #
            # We calculate the real value from transactions.
            advance_remaining = (
                PayrollService
                ._calculate_advance_remaining(
                    db,
                    main_advance,
                )
            )

        else:

            main_advance_amount = 0.0
            advance_remaining = 0.0

        # ======================================================
        # AVAILABLE SALARY
        # ======================================================

        available_salary = round(
            max(
                earned_salary
                - normal_deductions,
                0,
            ),
            2,
        )

        # ======================================================
        # ADVANCE DEDUCTION
        # ======================================================

        advance_deduction = round(
            min(
                advance_taken,
                available_salary,
            ),
            2,
        )

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

        payroll["employee_db_id"] = (
            employee.id
        )

        payroll["month"] = month
        payroll["year"] = year

        return payroll

    # ==========================================================
    # SAVE / FINALIZE PAYROLL
    # ==========================================================

    @staticmethod
    def save_payroll(
        db: Session,
        payroll_data: dict,
    ):
        """
        Save/finalize payroll.

        Rules:

        1. No existing payroll:
           Create and finalize.

        2. Existing draft payroll:
           Update and finalize.

        3. Existing finalized payroll:
           Reject.

        4. Existing paid payroll:
           Reject.

        5. Advance balance:
           Synchronize remaining amount using actual
           advance-recovery transactions.
        """

        # ======================================================
        # BASIC INFORMATION
        # ======================================================

        employee_id = payroll_data[
            "employee_db_id"
        ]

        year = payroll_data["year"]
        month = payroll_data["month"]

        # ======================================================
        # FIND EXISTING PAYROLL
        # ======================================================

        existing_payroll = (
            PayrollRepository.get_monthly_payroll(
                db,
                employee_id,
                year,
                month,
            )
        )

        # ======================================================
        # FIND MAIN ADVANCE
        # ======================================================

        recovery_transactions = (
            PayrollService
            ._get_recovery_transactions(
                db,
                employee_id,
            )
        )

        main_advance = (
            PayrollService
            ._get_main_advance(
                db,
                employee_id,
                recovery_transactions,
            )
        )

        # ======================================================
        # SYNCHRONIZE ADVANCE BALANCE
        # ======================================================

        if main_advance:

            real_remaining = (
                PayrollService
                ._sync_advance_balance(
                    db,
                    main_advance,
                )
            )

            payroll_data[
                "advance_remaining"
            ] = real_remaining

        # ======================================================
        # EXISTING PAYROLL
        # ======================================================

        if existing_payroll:

            # --------------------------------------------------
            # ALREADY PAID
            # --------------------------------------------------

            if existing_payroll.paid_at is not None:

                db.rollback()

                raise ValueError(
                    f"Payroll already paid for "
                    f"{month}/{year}. "
                    "Paid payroll cannot be overwritten."
                )

            # --------------------------------------------------
            # ALREADY FINALIZED
            # --------------------------------------------------

            is_finalized = (
                existing_payroll.finalized_at
                is not None
                or str(
                    existing_payroll.status or ""
                ).upper()
                == "FINALIZED"
            )

            if is_finalized:

                db.rollback()

                raise ValueError(
                    f"Payroll already finalized for "
                    f"{month}/{year}. "
                    "Historical payroll cannot be overwritten."
                )

            # --------------------------------------------------
            # UPDATE DRAFT PAYROLL
            # --------------------------------------------------

            existing_payroll.employee_id = (
                employee_id
            )

            existing_payroll.employee_name = (
                payroll_data["employee_name"]
            )

            existing_payroll.employee_code = (
                payroll_data["employee_id"]
            )

            existing_payroll.month = month
            existing_payroll.year = year

            # ==================================================
            # ATTENDANCE
            # ==================================================

            existing_payroll.total_working_days = (
                payroll_data["total_working_days"]
            )

            existing_payroll.present_days = (
                payroll_data["present_days"]
            )

            existing_payroll.half_days = (
                payroll_data["half_days"]
            )

            existing_payroll.absent_days = (
                payroll_data["absent_days"]
            )

            existing_payroll.leave_days = (
                payroll_data["leave_days"]
            )

            existing_payroll.paid_days = (
                payroll_data["paid_days"]
            )

            # ==================================================
            # SALARY
            # ==================================================

            existing_payroll.basic_salary = (
                payroll_data["basic_salary"]
            )

            existing_payroll.hra = (
                payroll_data["hra"]
            )

            existing_payroll.allowance = (
                payroll_data["allowance"]
            )

            existing_payroll.gross_salary = (
                payroll_data["gross_salary"]
            )

            existing_payroll.daily_salary = (
                payroll_data["daily_salary"]
            )

            existing_payroll.earned_salary = (
                payroll_data["earned_salary"]
            )

            # ==================================================
            # NORMAL DEDUCTIONS
            # ==================================================

            existing_payroll.pf = (
                payroll_data["pf"]
            )

            existing_payroll.professional_tax = (
                payroll_data["professional_tax"]
            )

            # ==================================================
            # ADVANCE
            # ==================================================

            existing_payroll.main_advance_amount = (
                payroll_data["main_advance_amount"]
            )

            existing_payroll.advance_taken = (
                payroll_data["advance_taken"]
            )

            existing_payroll.advance_deduction = (
                payroll_data["advance_deduction"]
            )

            existing_payroll.advance_remaining = (
                payroll_data["advance_remaining"]
            )

            # ==================================================
            # TOTALS
            # ==================================================

            existing_payroll.total_deductions = (
                payroll_data["total_deductions"]
            )

            existing_payroll.net_salary = (
                payroll_data["net_salary"]
            )

            # ==================================================
            # FINALIZE
            # ==================================================

            existing_payroll.status = "FINALIZED"

            existing_payroll.finalized_at = (
                datetime.now(timezone.utc)
            )

            # Never set paid_at here.
            # Saving payroll != paying salary.

            db.commit()
            db.refresh(existing_payroll)

            return existing_payroll

        # ======================================================
        # CREATE NEW PAYROLL
        # ======================================================

        payroll = Payroll(
            # --------------------------------------------------
            # EMPLOYEE
            # --------------------------------------------------

            employee_id=employee_id,

            employee_name=(
                payroll_data["employee_name"]
            ),

            employee_code=(
                payroll_data["employee_id"]
            ),

            month=month,
            year=year,

            # --------------------------------------------------
            # ATTENDANCE
            # --------------------------------------------------

            total_working_days=(
                payroll_data["total_working_days"]
            ),

            present_days=(
                payroll_data["present_days"]
            ),

            half_days=(
                payroll_data["half_days"]
            ),

            absent_days=(
                payroll_data["absent_days"]
            ),

            leave_days=(
                payroll_data["leave_days"]
            ),

            paid_days=(
                payroll_data["paid_days"]
            ),

            # --------------------------------------------------
            # SALARY
            # --------------------------------------------------

            basic_salary=(
                payroll_data["basic_salary"]
            ),

            hra=(
                payroll_data["hra"]
            ),

            allowance=(
                payroll_data["allowance"]
            ),

            gross_salary=(
                payroll_data["gross_salary"]
            ),

            daily_salary=(
                payroll_data["daily_salary"]
            ),

            earned_salary=(
                payroll_data["earned_salary"]
            ),

            # --------------------------------------------------
            # NORMAL DEDUCTIONS
            # --------------------------------------------------

            pf=(
                payroll_data["pf"]
            ),

            professional_tax=(
                payroll_data["professional_tax"]
            ),

            # --------------------------------------------------
            # ADVANCE
            # --------------------------------------------------

            main_advance_amount=(
                payroll_data["main_advance_amount"]
            ),

            advance_taken=(
                payroll_data["advance_taken"]
            ),

            advance_deduction=(
                payroll_data["advance_deduction"]
            ),

            advance_remaining=(
                payroll_data["advance_remaining"]
            ),

            # --------------------------------------------------
            # TOTALS
            # --------------------------------------------------

            total_deductions=(
                payroll_data["total_deductions"]
            ),

            net_salary=(
                payroll_data["net_salary"]
            ),

            # --------------------------------------------------
            # FINAL STATUS
            # --------------------------------------------------

            status="FINALIZED",

            finalized_at=(
                datetime.now(timezone.utc)
            ),
        )

        # ======================================================
        # CREATE
        # ======================================================

        saved_payroll = (
            PayrollRepository.create_payroll(
                db,
                payroll,
            )
        )

        return saved_payroll

    # ==========================================================
    # GET ALL PAYROLL HISTORY
    # ==========================================================

    @staticmethod
    def get_all_payroll(
        db: Session,
    ):

        return (
            PayrollRepository.get_all_payroll(
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
            PayrollRepository.get_payroll_by_id(
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
            PayrollRepository.get_employee_payroll(
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
            PayrollRepository.delete_payroll(
                db,
                payroll_id,
            )
        )
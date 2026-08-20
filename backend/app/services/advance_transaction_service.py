from sqlalchemy.orm import Session

from app.models.advance_transaction import AdvanceTransaction
from app.models.advance import Advance

from app.repository.advance_transaction_repository import (
    AdvanceTransactionRepository,
)

from app.repository.advance_repository import (
    AdvanceRepository,
)

from app.schemas.advance_transaction import (
    AdvanceTransactionCreate,
)


class AdvanceTransactionService:

    # ==========================================================
    # CREATE DAILY ADVANCE TRANSACTION
    # ==========================================================

    @staticmethod
    def create_transaction(
        db: Session,
        request: AdvanceTransactionCreate,
    ):

        # ======================================================
        # OPTIONAL MAIN ADVANCE
        # ======================================================
        #
        # advance_id is optional.
        #
        # If advance_id is provided:
        #     validate that the main advance exists
        #     and belongs to the employee.
        #
        # If advance_id is None:
        #     this is simply a daily advance transaction.
        #
        # IMPORTANT:
        # We DO NOT create a new Advance here.
        # We DO NOT increase Advance.amount.
        # We DO NOT increase Advance.remaining_amount.
        #
        # Example:
        #
        # Main Advance = ₹10,000
        #
        # Daily:
        # Food    ₹200
        # Travel  ₹300
        #
        # Daily total = ₹500
        #
        # Main Advance remains ₹10,000.
        # ======================================================

        if request.advance_id is not None:

            advance = (
                AdvanceRepository
                .get_advance_by_id(
                    db,
                    request.advance_id,
                )
            )

            # Main advance does not exist
            if advance is None:
                return None

            # Make sure the main advance
            # belongs to this employee
            if (
                advance.employee_id
                != request.employee_id
            ):
                return None

        # ======================================================
        # CREATE DAILY TRANSACTION
        # ======================================================

        transaction = AdvanceTransaction(

            employee_id=request.employee_id,

            # Can be None.
            # This is intentional.
            advance_id=request.advance_id,

            amount=request.amount,

            transaction_date=(
                request.transaction_date
            ),

            reason=request.reason,
        )

        # ======================================================
        # SAVE DAILY TRANSACTION
        # ======================================================

        return (
            AdvanceTransactionRepository
            .create_transaction(
                db,
                transaction,
            )
        )

    # ==========================================================
    # GET ALL DAILY TRANSACTIONS
    # ==========================================================

    @staticmethod
    def get_all_transactions(
        db: Session,
    ):

        return (
            AdvanceTransactionRepository
            .get_all_transactions(
                db
            )
        )

    # ==========================================================
    # GET TRANSACTION BY ID
    # ==========================================================

    @staticmethod
    def get_transaction_by_id(
        db: Session,
        transaction_id: int,
    ):

        return (
            AdvanceTransactionRepository
            .get_transaction_by_id(
                db,
                transaction_id,
            )
        )

    # ==========================================================
    # GET TRANSACTIONS BY EMPLOYEE
    # ==========================================================

    @staticmethod
    def get_transactions_by_employee(
        db: Session,
        employee_id: int,
    ):

        return (
            AdvanceTransactionRepository
            .get_transactions_by_employee(
                db,
                employee_id,
            )
        )

    # ==========================================================
    # GET TRANSACTIONS BY MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def get_transactions_by_advance(
        db: Session,
        advance_id: int,
    ):

        return (
            AdvanceTransactionRepository
            .get_transactions_by_advance(
                db,
                advance_id,
            )
        )

    # ==========================================================
    # GET TOTAL DAILY ADVANCES BY EMPLOYEE
    # ==========================================================

    @staticmethod
    def get_total_by_employee(
        db: Session,
        employee_id: int,
    ):

        transactions = (
            AdvanceTransactionRepository
            .get_transactions_by_employee(
                db,
                employee_id,
            )
        )

        total = sum(
            float(
                transaction.amount or 0
            )
            for transaction in transactions
        )

        return round(
            total,
            2,
        )

    # ==========================================================
    # DELETE DAILY TRANSACTION
    # ==========================================================

    @staticmethod
    def delete_transaction(
        db: Session,
        transaction_id: int,
    ):

        transaction = (
            AdvanceTransactionRepository
            .get_transaction_by_id(
                db,
                transaction_id,
            )
        )

        if transaction is None:
            return None

        # IMPORTANT:
        #
        # We only delete the daily transaction.
        #
        # We DO NOT modify the main advance.
        #

        AdvanceTransactionRepository.delete_transaction(
            db,
            transaction,
        )

        return True
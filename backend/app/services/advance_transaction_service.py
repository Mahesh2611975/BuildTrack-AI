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
        # VALIDATE MAIN ADVANCE IF PROVIDED
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

            # Make sure advance belongs
            # to the selected employee
            if (
                advance.employee_id
                != request.employee_id
            ):
                return None

        # ======================================================
        # CREATE DAILY TRANSACTION
        #
        # IMPORTANT:
        # This does NOT modify the main advance amount.
        #
        # Example:
        #
        # Main Advance = ₹10,000
        #
        # Daily transactions:
        # Food      = ₹100
        # Travel    = ₹200
        # Personal  = ₹500
        #
        # These are tracked separately.
        # ======================================================

        transaction = AdvanceTransaction(

            employee_id=request.employee_id,

            advance_id=request.advance_id,

            amount=request.amount,

            transaction_date=(
                request.transaction_date
            ),

            reason=request.reason,
        )

        return (
            AdvanceTransactionRepository
            .create_transaction(
                db,
                transaction,
            )
        )

    # ==========================================================
    # GET ALL TRANSACTIONS
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
    # GET TRANSACTIONS BY ADVANCE
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
    # GET TOTAL DAILY ADVANCE BY EMPLOYEE
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
            float(transaction.amount or 0)
            for transaction in transactions
        )

        return round(total, 2)

    # ==========================================================
    # DELETE TRANSACTION
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

        AdvanceTransactionRepository.delete_transaction(
            db,
            transaction,
        )

        return True
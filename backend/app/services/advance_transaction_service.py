from sqlalchemy.orm import Session

from app.models.advance_transaction import (
    AdvanceTransaction,
)

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
    # CREATE ADVANCE RECOVERY
    # ==========================================================

    @staticmethod
    def create_transaction(
        db: Session,
        request: AdvanceTransactionCreate,
    ):
        """
        Create a salary advance recovery.

        Example:

        Main Advance       ₹10,000
        Remaining          ₹10,000

        Recovery           ₹500

        New Remaining      ₹9,500
        Status              Partially Paid
        """

        # ======================================================
        # ADVANCE ID IS REQUIRED
        # ======================================================

        if request.advance_id is None:

            raise ValueError(
                "advance_id is required for salary advance recovery"
            )

        # ======================================================
        # FIND MAIN ADVANCE
        # ======================================================

        advance = (
            AdvanceRepository.get_advance_by_id(
                db,
                request.advance_id,
            )
        )

        if advance is None:
            return None

        # ======================================================
        # VALIDATE EMPLOYEE
        # ======================================================

        if (
            advance.employee_id
            != request.employee_id
        ):

            raise ValueError(
                "Advance does not belong to this employee"
            )

        # ======================================================
        # VALIDATE ADVANCE STATUS
        # ======================================================

        # A salary advance should normally be approved
        # before recovery starts.

        if advance.status == "Pending":

            raise ValueError(
                "Advance must be approved before recovery"
            )

        # ======================================================
        # GET CURRENT BALANCE
        # ======================================================

        remaining_amount = float(
            advance.remaining_amount or 0
        )

        recovery_amount = float(
            request.amount
        )

        # ======================================================
        # VALIDATE RECOVERY AMOUNT
        # ======================================================

        if recovery_amount <= 0:

            raise ValueError(
                "Recovery amount must be greater than 0"
            )

        # ======================================================
        # PREVENT OVER-RECOVERY
        # ======================================================

        if recovery_amount > remaining_amount:

            raise ValueError(
                "Recovery amount cannot be greater "
                "than remaining advance balance"
            )

        # ======================================================
        # CREATE RECOVERY TRANSACTION
        # ======================================================

        transaction = AdvanceTransaction(

            employee_id=request.employee_id,

            advance_id=request.advance_id,

            amount=recovery_amount,

            transaction_date=(
                request.transaction_date
            ),

            reason=request.reason,
        )

        # ======================================================
        # REDUCE ADVANCE BALANCE
        # ======================================================

        new_remaining = (
            remaining_amount
            - recovery_amount
        )

        advance.remaining_amount = round(
            new_remaining,
            2,
        )

        # ======================================================
        # UPDATE ADVANCE STATUS
        # ======================================================

        if advance.remaining_amount <= 0:

            advance.remaining_amount = 0

            advance.status = "Paid"

        else:

            advance.status = "Partially Paid"

        # ======================================================
        # SAVE BOTH RECORDS
        # ======================================================

        db.add(transaction)

        db.commit()

        db.refresh(transaction)

        return transaction

    # ==========================================================
    # GET ALL RECOVERIES
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
    # GET RECOVERY BY ID
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
    # GET RECOVERIES BY EMPLOYEE
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
    # GET RECOVERIES BY ADVANCE
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
    # GET TOTAL RECOVERED BY EMPLOYEE
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
    # GET TOTAL RECOVERED FOR ONE ADVANCE
    # ==========================================================

    @staticmethod
    def get_total_by_advance(
        db: Session,
        advance_id: int,
    ):

        transactions = (
            AdvanceTransactionRepository
            .get_transactions_by_advance(
                db,
                advance_id,
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
    # DELETE RECOVERY
    # ==========================================================

    @staticmethod
    def delete_transaction(
        db: Session,
        transaction_id: int,
    ):
        """
        Delete a recovery transaction.

        Example:

        Before:

        Main Advance       ₹10,000
        Remaining           ₹9,500
        Recovery              ₹500

        Delete recovery:

        Main Advance       ₹10,000
        Remaining          ₹10,000
        """

        # ======================================================
        # FIND TRANSACTION
        # ======================================================

        transaction = (
            AdvanceTransactionRepository
            .get_transaction_by_id(
                db,
                transaction_id,
            )
        )

        if transaction is None:
            return None

        # ======================================================
        # FIND LINKED ADVANCE
        # ======================================================

        advance = None

        if transaction.advance_id is not None:

            advance = (
                AdvanceRepository.get_advance_by_id(
                    db,
                    transaction.advance_id,
                )
            )

        # ======================================================
        # RESTORE ADVANCE BALANCE
        # ======================================================

        if advance is not None:

            current_remaining = float(
                advance.remaining_amount or 0
            )

            recovered_amount = float(
                transaction.amount or 0
            )

            original_amount = float(
                advance.amount or 0
            )

            restored_remaining = (
                current_remaining
                + recovered_amount
            )

            # Never allow remaining amount
            # to exceed original advance.

            if restored_remaining > original_amount:

                restored_remaining = (
                    original_amount
                )

            advance.remaining_amount = round(
                restored_remaining,
                2,
            )

            # ==================================================
            # RESTORE STATUS
            # ==================================================

            if (
                advance.remaining_amount
                >= original_amount
            ):

                advance.remaining_amount = (
                    original_amount
                )

                # Since the advance is no longer
                # being recovered, restore it
                # to Approved.

                advance.status = "Approved"

            else:

                advance.status = "Partially Paid"

        # ======================================================
        # DELETE TRANSACTION
        # ======================================================

        db.delete(transaction)

        db.commit()

        return True
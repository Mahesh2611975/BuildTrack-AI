from sqlalchemy.orm import Session

from app.models.advance import Advance
from app.models.advance_transaction import AdvanceTransaction

from app.repository.advance_repository import (
    AdvanceRepository,
)

from app.repository.advance_transaction_repository import (
    AdvanceTransactionRepository,
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
        # FIND ADVANCE ACCOUNT
        # ======================================================

        advance = None

        # ------------------------------------------------------
        # If user selected a specific advance
        # ------------------------------------------------------

        if request.advance_id is not None:

            advance = (
                AdvanceRepository
                .get_advance_by_id(
                    db,
                    request.advance_id,
                )
            )

            if advance is None:
                return None

            # Make sure advance belongs to employee
            if advance.employee_id != request.employee_id:
                return None

        # ------------------------------------------------------
        # Otherwise find employee's active advance
        # ------------------------------------------------------

        else:

            advance = (
                db.query(Advance)
                .filter(
                    Advance.employee_id
                    == request.employee_id,

                    Advance.status.in_(
                        [
                            "Pending",
                            "Approved",
                            "Partially Paid",
                        ]
                    ),

                    Advance.remaining_amount > 0,
                )
                .order_by(
                    Advance.id.desc()
                )
                .first()
            )

        # ======================================================
        # NO ADVANCE ACCOUNT FOUND
        # ======================================================

        if advance is None:

            # A daily transaction should normally be made
            # against an existing advance.
            #
            # If there is no advance, create an advance account
            # using this transaction as the initial advance.
            #
            # Since the employee immediately takes this amount,
            # the remaining balance becomes ZERO.

            advance = Advance(
                advance_code=(
                    AdvanceTransactionService
                    .generate_advance_code(db)
                ),

                employee_id=request.employee_id,

                amount=request.amount,

                remaining_amount=0,

                advance_date=request.transaction_date,

                reason=request.reason,

                status="Approved",
            )

            db.add(advance)

            db.flush()

        else:

            # ==================================================
            # CHECK REMAINING BALANCE
            # ==================================================

            current_remaining = float(
                advance.remaining_amount or 0
            )

            requested_amount = float(
                request.amount
            )

            if requested_amount <= 0:
                return None

            # Employee cannot take more than remaining balance
            if requested_amount > current_remaining:

                raise ValueError(
                    f"Insufficient advance balance. "
                    f"Remaining amount is ₹{current_remaining:.2f}"
                )

            # ==================================================
            # DEDUCT DAILY TRANSACTION
            # ==================================================

            advance.remaining_amount = (
                current_remaining
                - requested_amount
            )

            # ==================================================
            # UPDATE STATUS
            # ==================================================

            if advance.remaining_amount <= 0:

                advance.remaining_amount = 0

                advance.status = "Paid"

            else:

                advance.status = "Partially Paid"

        # ======================================================
        # CREATE TRANSACTION RECORD
        # ======================================================

        transaction = AdvanceTransaction(

            employee_id=request.employee_id,

            advance_id=advance.id,

            amount=request.amount,

            transaction_date=(
                request.transaction_date
            ),

            reason=request.reason,
        )

        db.add(transaction)

        # ======================================================
        # SAVE
        # ======================================================

        db.commit()

        db.refresh(transaction)

        return transaction

    # ==========================================================
    # GENERATE ADVANCE CODE
    # ==========================================================

    @staticmethod
    def generate_advance_code(
        db: Session,
    ):

        last_advance = (
            db.query(Advance)
            .order_by(
                Advance.id.desc()
            )
            .first()
        )

        if last_advance is None:
            return "ADV001"

        return (
            f"ADV{last_advance.id + 1:03d}"
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

        # ======================================================
        # FIND RELATED ADVANCE
        # ======================================================

        advance = None

        if transaction.advance_id:

            advance = (
                AdvanceRepository
                .get_advance_by_id(
                    db,
                    transaction.advance_id,
                )
            )

        # ======================================================
        # RESTORE REMAINING BALANCE
        # ======================================================

        if advance:

            advance.remaining_amount = (
                float(
                    advance.remaining_amount
                    or 0
                )
                + float(
                    transaction.amount
                )
            )

            # Never allow remaining to exceed
            # original advance amount

            if advance.remaining_amount > advance.amount:

                advance.remaining_amount = (
                    advance.amount
                )

            # ==================================================
            # RESTORE STATUS
            # ==================================================

            if advance.remaining_amount >= advance.amount:

                advance.status = "Approved"

            elif advance.remaining_amount > 0:

                advance.status = "Partially Paid"

            else:

                advance.status = "Paid"

        # ======================================================
        # DELETE TRANSACTION
        # ======================================================

        AdvanceTransactionRepository.delete_transaction(
            db,
            transaction,
        )

        # ======================================================
        # SAVE CHANGES
        # ======================================================

        db.commit()

        return True
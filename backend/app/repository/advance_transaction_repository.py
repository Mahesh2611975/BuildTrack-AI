from sqlalchemy.orm import Session

from app.models.advance_transaction import (
    AdvanceTransaction,
)


class AdvanceTransactionRepository:

    # ==========================================================
    # CREATE TRANSACTION
    # ==========================================================

    @staticmethod
    def create_transaction(
        db: Session,
        transaction: AdvanceTransaction,
    ):

        db.add(transaction)

        db.commit()

        db.refresh(transaction)

        return transaction

    # ==========================================================
    # GET ALL TRANSACTIONS
    # ==========================================================

    @staticmethod
    def get_all_transactions(
        db: Session,
    ):

        return (
            db.query(
                AdvanceTransaction
            )
            .order_by(
                AdvanceTransaction
                .transaction_date
                .desc()
            )
            .all()
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
            db.query(
                AdvanceTransaction
            )
            .filter(
                AdvanceTransaction.id
                == transaction_id
            )
            .first()
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
            db.query(
                AdvanceTransaction
            )
            .filter(
                AdvanceTransaction.employee_id
                == employee_id
            )
            .order_by(
                AdvanceTransaction
                .transaction_date
                .desc()
            )
            .all()
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
            db.query(
                AdvanceTransaction
            )
            .filter(
                AdvanceTransaction.advance_id
                == advance_id
            )
            .order_by(
                AdvanceTransaction
                .transaction_date
                .desc()
            )
            .all()
        )

    # ==========================================================
    # DELETE TRANSACTION
    # ==========================================================

    @staticmethod
    def delete_transaction(
        db: Session,
        transaction: AdvanceTransaction,
    ):

        db.delete(
            transaction
        )

        db.commit()

        return True
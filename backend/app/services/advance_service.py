from sqlalchemy.orm import Session

from app.models.advance import Advance

from app.schemas.advance import (
    AdvanceCreate,
    AdvanceUpdate,
)

from app.repository.advance_repository import (
    AdvanceRepository,
)


class AdvanceService:

    # ==========================================================
    # CREATE MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def create_advance(
        db: Session,
        request: AdvanceCreate,
    ):

        # ------------------------------------------------------
        # Find the latest advance
        # ------------------------------------------------------

        latest_advance = (
            db.query(Advance)
            .order_by(
                Advance.id.desc()
            )
            .first()
        )

        # ------------------------------------------------------
        # Generate next advance number
        # ------------------------------------------------------

        if latest_advance:

            try:

                last_number = int(
                    latest_advance.advance_code
                    .replace("ADV", "")
                )

                next_number = (
                    last_number + 1
                )

            except (
                ValueError,
                AttributeError,
            ):

                next_number = (
                    latest_advance.id + 1
                )

        else:

            next_number = 1

        # ------------------------------------------------------
        # Generate advance code
        # Example:
        # ADV001
        # ADV002
        # ADV003
        # ------------------------------------------------------

        advance_code = (
            f"ADV{next_number:03d}"
        )

        # ------------------------------------------------------
        # Create main advance
        # ------------------------------------------------------

        advance = Advance(

            advance_code=advance_code,

            employee_id=request.employee_id,

            amount=request.amount,

            # Initially remaining amount
            # is the complete advance amount.
            remaining_amount=request.amount,

            advance_date=request.advance_date,

            reason=request.reason,

            status="Pending",

        )

        # ------------------------------------------------------
        # Save
        # ------------------------------------------------------

        return AdvanceRepository.create_advance(
            db,
            advance,
        )


    # ==========================================================
    # GET ALL ADVANCES
    # ==========================================================

    @staticmethod
    def get_all_advances(
        db: Session,
    ):

        return AdvanceRepository.get_all_advances(
            db
        )


    # ==========================================================
    # GET ADVANCE BY ID
    # ==========================================================

    @staticmethod
    def get_advance_by_id(
        db: Session,
        advance_id: int,
    ):

        return AdvanceRepository.get_advance_by_id(
            db,
            advance_id,
        )


    # ==========================================================
    # GET ADVANCES BY EMPLOYEE
    # ==========================================================

    @staticmethod
    def get_advances_by_employee(
        db: Session,
        employee_id: int,
    ):

        return AdvanceRepository.get_advances_by_employee(
            db,
            employee_id,
        )


    # ==========================================================
    # UPDATE MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def update_advance(
        db: Session,
        advance_id: int,
        request: AdvanceUpdate,
    ):

        advance = (
            AdvanceRepository.get_advance_by_id(
                db,
                advance_id,
            )
        )

        if advance is None:
            return None

        # ------------------------------------------------------
        # Remember the old amount
        # ------------------------------------------------------

        old_amount = float(
            advance.amount or 0
        )

        old_remaining = float(
            advance.remaining_amount or 0
        )

        # ------------------------------------------------------
        # Calculate already-used amount
        #
        # Example:
        #
        # Old amount     = ₹10,000
        # Old remaining  = ₹7,000
        #
        # Already used   = ₹3,000
        # ------------------------------------------------------

        already_used = (
            old_amount - old_remaining
        )

        if already_used < 0:
            already_used = 0

        # ------------------------------------------------------
        # Update amount
        # ------------------------------------------------------

        new_amount = float(
            request.amount
        )

        # ------------------------------------------------------
        # Prevent remaining amount from becoming negative
        # ------------------------------------------------------

        new_remaining = (
            new_amount - already_used
        )

        if new_remaining < 0:
            new_remaining = 0

        # ------------------------------------------------------
        # Update fields
        # ------------------------------------------------------

        advance.amount = new_amount

        advance.remaining_amount = (
            round(
                new_remaining,
                2,
            )
        )

        advance.advance_date = (
            request.advance_date
        )

        advance.reason = (
            request.reason
        )

        advance.status = (
            request.status
        )

        # ------------------------------------------------------
        # Save changes
        # ------------------------------------------------------

        return AdvanceRepository.update_advance(
            db,
            advance,
        )


    # ==========================================================
    # DELETE MAIN ADVANCE
    # ==========================================================

    @staticmethod
    def delete_advance(
        db: Session,
        advance_id: int,
    ):

        advance = (
            AdvanceRepository.get_advance_by_id(
                db,
                advance_id,
            )
        )

        if advance is None:
            return None

        # ------------------------------------------------------
        # Delete main advance
        #
        # AdvanceTransaction.advance_id uses
        # ON DELETE SET NULL.
        #
        # Therefore linked daily transactions remain,
        # but their advance_id becomes NULL.
        # ------------------------------------------------------

        AdvanceRepository.delete_advance(
            db,
            advance,
        )

        return True
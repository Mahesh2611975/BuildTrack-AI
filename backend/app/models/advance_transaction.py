from sqlalchemy import (
    Column,
    Integer,
    Float,
    Date,
    String,
    ForeignKey,
    DateTime,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class AdvanceTransaction(Base):

    __tablename__ = "advance_transactions"

    # ==========================================================
    # PRIMARY KEY
    # ==========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ==========================================================
    # EMPLOYEE
    # ==========================================================

    employee_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    # ==========================================================
    # MAIN ADVANCE
    # ==========================================================

    advance_id = Column(
        Integer,
        ForeignKey(
            "advances.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    # ==========================================================
    # DAILY AMOUNT
    # ==========================================================

    amount = Column(
        Float,
        nullable=False,
    )

    # ==========================================================
    # TRANSACTION DATE
    # ==========================================================

    transaction_date = Column(
        Date,
        nullable=False,
    )

    # ==========================================================
    # REASON
    # ==========================================================

    reason = Column(
        String(255),
        nullable=True,
    )

    # ==========================================================
    # CREATED AT
    # ==========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # ==========================================================
    # RELATIONSHIPS
    # ==========================================================

    employee = relationship(
        "Employee",
    )

    advance = relationship(
        "Advance",
    )
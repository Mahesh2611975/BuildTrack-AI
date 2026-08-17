from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    ForeignKey,
    DateTime,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Advance(Base):

    __tablename__ = "advances"

    # ==========================================================
    # PRIMARY KEY
    # ==========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ==========================================================
    # ADVANCE CODE
    # ==========================================================

    advance_code = Column(
        String(20),
        unique=True,
        nullable=False,
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
    # ORIGINAL ADVANCE AMOUNT
    # ==========================================================

    amount = Column(
        Float,
        nullable=False,
    )

    # ==========================================================
    # REMAINING ADVANCE BALANCE
    # ==========================================================

    remaining_amount = Column(
        Float,
        nullable=False,
        default=0,
    )

    # ==========================================================
    # ADVANCE DATE
    # ==========================================================

    advance_date = Column(
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
    # STATUS
    # ==========================================================

    status = Column(
        String(20),
        nullable=False,
        default="Pending",
    )

    # ==========================================================
    # CREATED DATE
    # ==========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # ==========================================================
    # EMPLOYEE RELATIONSHIP
    # ==========================================================

    employee = relationship(
        "Employee",
        back_populates="advances",
    )
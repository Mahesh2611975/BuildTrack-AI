from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Payroll(Base):

    __tablename__ = "payrolls"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    employee_name = Column(
        String(100),
        nullable=False,
    )

    employee_code = Column(
        String(50),
        nullable=False,
    )

    month = Column(
        Integer,
        nullable=False,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    total_working_days = Column(
        Integer,
        nullable=False,
    )

    present_days = Column(
        Integer,
        default=0,
        nullable=False,
    )

    half_days = Column(
        Integer,
        default=0,
        nullable=False,
    )

    absent_days = Column(
        Integer,
        default=0,
        nullable=False,
    )

    leave_days = Column(
        Integer,
        default=0,
        nullable=False,
    )

    paid_days = Column(
        Float,
        default=0,
        nullable=False,
    )

    basic_salary = Column(
        Float,
        nullable=False,
    )

    hra = Column(
        Float,
        default=0,
        nullable=False,
    )

    allowance = Column(
        Float,
        default=0,
        nullable=False,
    )

    gross_salary = Column(
        Float,
        nullable=False,
    )

    daily_salary = Column(
        Float,
        nullable=False,
    )

    earned_salary = Column(
        Float,
        nullable=False,
    )

    pf = Column(
        Float,
        default=0,
        nullable=False,
    )

    professional_tax = Column(
        Float,
        default=0,
        nullable=False,
    )

    # ==========================================================
    # ADVANCE DETAILS
    # ==========================================================

    # Original/main employee advance amount
    main_advance_amount = Column(
        Float,
        default=0,
        nullable=False,
    )

    # Total daily advances taken during the payroll month
    advance_taken = Column(
        Float,
        default=0,
        nullable=False,
    )

    # Daily advance deducted from this month's salary
    advance_deduction = Column(
        Float,
        default=0,
        nullable=False,
    )

    # Remaining balance of the main advance
    advance_remaining = Column(
        Float,
        default=0,
        nullable=False,
    )

    # ==========================================================
    # TOTAL PAYROLL DEDUCTIONS
    # ==========================================================

    total_deductions = Column(
        Float,
        default=0,
        nullable=False,
    )

    net_salary = Column(
        Float,
        nullable=False,
    )

    employee = relationship(
        "Employee",
    )
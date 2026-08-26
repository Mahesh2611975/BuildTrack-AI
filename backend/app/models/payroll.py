from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    UniqueConstraint,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Payroll(Base):

    __tablename__ = "payrolls"

    # ==========================================================
    # TABLE CONSTRAINTS
    # ==========================================================

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "year",
            "month",
            name="uq_payroll_employee_year_month",
        ),
    )

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
        index=True,
    )

    employee_name = Column(
        String(100),
        nullable=False,
    )

    employee_code = Column(
        String(50),
        nullable=False,
    )

    # ==========================================================
    # PAYROLL PERIOD
    # ==========================================================

    month = Column(
        Integer,
        nullable=False,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    # ==========================================================
    # PAYROLL STATUS
    # ==========================================================
    #
    # DRAFT
    # FINALIZED
    # PAID
    #
    # New saved payroll starts as FINALIZED.
    # ==========================================================

    status = Column(
        String(20),
        nullable=False,
        default="FINALIZED",
        index=True,
    )

    # ==========================================================
    # PAYROLL DATES
    # ==========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    finalized_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    paid_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    # ==========================================================
    # ATTENDANCE SNAPSHOT
    # ==========================================================

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

    # ==========================================================
    # SALARY SNAPSHOT
    # ==========================================================

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

    # ==========================================================
    # STATUTORY DEDUCTIONS SNAPSHOT
    # ==========================================================

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
    # ADVANCE SNAPSHOT
    # ==========================================================

    # Original salary advance amount
    main_advance_amount = Column(
        Float,
        default=0,
        nullable=False,
    )

    # Total recovery transactions during this month
    advance_taken = Column(
        Float,
        default=0,
        nullable=False,
    )

    # Actual amount deducted from this month's salary
    advance_deduction = Column(
        Float,
        default=0,
        nullable=False,
    )

    # Remaining advance balance
    advance_remaining = Column(
        Float,
        default=0,
        nullable=False,
    )

    # ==========================================================
    # FINAL PAYROLL TOTALS
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

    # ==========================================================
    # EMPLOYEE RELATIONSHIP
    # ==========================================================

    employee = relationship(
        "Employee",
    )
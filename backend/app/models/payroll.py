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
    advance_deduction = Column(
        Float,
        default=0,
        nullable=False,
    )
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
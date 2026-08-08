from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class Salary(Base):
    __tablename__ = "salaries"

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

    year = Column(
        Integer,
        nullable=False,
    )

    month = Column(
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

    total_deductions = Column(
        Float,
        default=0,
        nullable=False,
    )

    net_salary = Column(
        Float,
        nullable=False,
    )

    status = Column(
        String(20),
        default="Pending",
        nullable=False,
    )

    employee = relationship(
        "Employee",
    )

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "year",
            "month",
            name="uq_employee_salary_month",
        ),
    )
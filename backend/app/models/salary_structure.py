from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class SalaryStructure(Base):
    __tablename__ = "salary_structures"

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
        unique=True,
    )

    basic_salary = Column(
        Float,
        nullable=False,
    )

    hra = Column(
        Float,
        default=0,
    )

    allowance = Column(
        Float,
        default=0,
    )

    pf = Column(
        Float,
        default=0,
    )

    professional_tax = Column(
        Float,
        default=0,
    )

    employee = relationship(
        "Employee",
    )
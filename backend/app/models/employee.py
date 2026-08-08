from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Float,
    Boolean,
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Employee(Base):

    __tablename__ = "employees"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id = Column(
        String(20),
        unique=True,
        nullable=False,
    )

    full_name = Column(
        String(100),
        nullable=False,
    )

    mobile_number = Column(
        String(15),
        unique=True,
        nullable=False,
    )

    email = Column(
        String(100),
        unique=True,
        nullable=True,
    )

    designation = Column(
        String(100),
        nullable=False,
    )

    department = Column(
        String(100),
        nullable=False,
    )

    salary = Column(
        Float,
        nullable=False,
    )

    joining_date = Column(
        Date,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    project_employees = relationship(
        "ProjectEmployee",
        back_populates="employee",
        cascade="all, delete-orphan",
    )

    attendance = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan",
    )

    tasks = relationship(
        "Task",
        back_populates="employee",
        cascade="all, delete-orphan",
    )
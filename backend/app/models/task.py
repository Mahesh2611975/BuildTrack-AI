from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(100), nullable=False)

    description = Column(String(500), nullable=True)

    priority = Column(String(20), nullable=False)

    status = Column(
        String(20),
        nullable=False,
        default="Pending",
    )

    start_date = Column(Date, nullable=False)

    due_date = Column(Date, nullable=False)

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )

    employee_id = Column(
        Integer,
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
    )

    project = relationship(
        "Project",
        back_populates="tasks",
    )

    employee = relationship(
        "Employee",
        back_populates="tasks",
    )
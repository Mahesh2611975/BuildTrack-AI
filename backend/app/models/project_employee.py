from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class ProjectEmployee(Base):
    __tablename__ = "project_employees"

    id = Column(Integer, primary_key=True, index=True)

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
        back_populates="project_employees",
    )

    employee = relationship(
        "Employee",
        back_populates="project_employees",
    )
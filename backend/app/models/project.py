from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(String(20), unique=True, nullable=False)

    project_name = Column(String(100), nullable=False)

    client_name = Column(String(100), nullable=False)

    location = Column(String(255), nullable=False)

    description = Column(String(500))

    start_date = Column(Date, nullable=False)

    expected_end_date = Column(Date, nullable=False)

    budget = Column(Float, nullable=False)

    status = Column(
        String(30),
        default="Planned"
    )

    contractor_id = Column(
        Integer,
        ForeignKey("contractors.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    contractor = relationship("Contractor")
    project_employees = relationship(
        "ProjectEmployee",
        back_populates="project",
        cascade="all, delete-orphan",
    )
from sqlalchemy import (
    Column,
    Integer,
    Date,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class EquipmentAssignment(Base):
    __tablename__ = "equipment_assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    equipment_id = Column(
        Integer,
        ForeignKey(
            "equipment.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    project_id = Column(
        Integer,
        ForeignKey(
            "projects.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    assigned_date = Column(
        Date,
        nullable=False,
    )

    expected_return_date = Column(
        Date,
        nullable=True,
    )

    status = Column(
        String(30),
        default="Assigned",
    )

    equipment = relationship("Equipment")

    project = relationship("Project")
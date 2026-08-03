from sqlalchemy import (
    Column,
    Integer,
    Float,
    Date,
    Time,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class EquipmentWorkLog(Base):
    __tablename__ = "equipment_work_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    assignment_id = Column(
        Integer,
        ForeignKey(
            "equipment_assignments.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    work_date = Column(
        Date,
        nullable=False,
    )

    start_time = Column(
        Time,
        nullable=False,
    )

    end_time = Column(
        Time,
        nullable=False,
    )

    hourly_rate = Column(
        Float,
        nullable=False,
    )

    working_hours = Column(
        Float,
        nullable=False,
    )

    total_cost = Column(
        Float,
        nullable=False,
    )

    remarks = Column(
        String(255),
        nullable=True,
    )

    assignment = relationship(
        "EquipmentAssignment",
    )
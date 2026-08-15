from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    ForeignKey,
    DateTime,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Advance(Base):

    __tablename__ = "advances"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    advance_code = Column(
        String(20),
        unique=True,
        nullable=False,
    )

    employee_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    amount = Column(
        Float,
        nullable=False,
    )

    advance_date = Column(
        Date,
        nullable=False,
    )

    reason = Column(
        String(255),
        nullable=True,
    )

    status = Column(
        String(20),
        nullable=False,
        default="Pending",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    employee = relationship(
        "Employee",
        back_populates="advances",
    )
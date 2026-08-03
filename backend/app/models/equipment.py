from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    equipment_code = Column(
        String(20),
        unique=True,
        nullable=False,
    )

    equipment_name = Column(
        String(100),
        nullable=False,
    )

    category = Column(
        String(50),
        nullable=False,
    )

    manufacturer = Column(
        String(100),
        nullable=True,
    )

    purchase_date = Column(
        Date,
        nullable=True,
    )

    purchase_cost = Column(
        Float,
        nullable=True,
    )

    status = Column(
        String(30),
        default="Available",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
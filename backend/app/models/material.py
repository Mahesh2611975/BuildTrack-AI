from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)

    material_code = Column(
        String(20),
        unique=True,
        nullable=False,
    )

    material_name = Column(
        String(100),
        nullable=False,
    )

    category = Column(
        String(50),
        nullable=False,
    )

    unit = Column(
        String(20),
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
        default=0,
    )

    unit_price = Column(
        Float,
        nullable=False,
    )

    supplier = Column(
        String(100),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
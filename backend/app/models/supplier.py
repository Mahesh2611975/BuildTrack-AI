from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)

    supplier_code = Column(
        String(20),
        unique=True,
        nullable=False,
    )

    company_name = Column(
        String(100),
        nullable=False,
    )

    contact_person = Column(
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

    address = Column(
        String(255),
        nullable=True,
    )

    gst_number = Column(
        String(50),
        unique=True,
        nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
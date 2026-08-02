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


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    po_number = Column(
        String(30),
        unique=True,
        nullable=False,
    )

    supplier_name = Column(
        String(100),
        nullable=False,
    )

    material_id = Column(
        Integer,
        ForeignKey("materials.id", ondelete="CASCADE"),
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    unit_price = Column(
        Float,
        nullable=False,
    )

    total_amount = Column(
        Float,
        nullable=False,
    )

    order_date = Column(
        Date,
        nullable=False,
    )

    expected_delivery_date = Column(
        Date,
        nullable=False,
    )

    status = Column(
        String(30),
        default="Pending",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    material = relationship("Material")
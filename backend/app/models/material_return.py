from sqlalchemy import (
    Column,
    Integer,
    Float,
    Date,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class MaterialReturn(Base):
    __tablename__ = "material_returns"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    material_issue_id = Column(
        Integer,
        ForeignKey(
            "material_issues.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    return_date = Column(
        Date,
        nullable=False,
    )

    remarks = Column(
        String(255),
    )

    material_issue = relationship(
        "MaterialIssue",
    )
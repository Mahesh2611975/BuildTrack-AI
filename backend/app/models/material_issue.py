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


class MaterialIssue(Base):
    __tablename__ = "material_issues"

    id = Column(Integer, primary_key=True, index=True)

    material_id = Column(
        Integer,
        ForeignKey("materials.id", ondelete="CASCADE"),
        nullable=False,
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    issue_date = Column(
        Date,
        nullable=False,
    )

    remarks = Column(
        String(255),
        nullable=True,
    )

    material = relationship("Material")
    project = relationship("Project")
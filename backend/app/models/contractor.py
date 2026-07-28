from sqlalchemy import Column, Integer, String, Boolean

from app.database.base import Base


class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True, index=True)

    contractor_id = Column(String(20), unique=True, nullable=False)

    company_name = Column(String(100), nullable=False)

    contractor_name = Column(String(100), nullable=False)

    mobile_number = Column(String(15), unique=True, nullable=False)

    email = Column(String(100), unique=True)

    address = Column(String(255))

    licence_number = Column(String(100), unique=True)

    gst_number = Column(String(50), unique=True)

    experience_years = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)
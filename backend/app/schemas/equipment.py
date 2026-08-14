from datetime import date

from pydantic import BaseModel


# ==========================================================
# CREATE EQUIPMENT
# ==========================================================

class EquipmentCreate(BaseModel):

    equipment_code: str

    equipment_name: str

    category: str

    manufacturer: str | None = None

    # Owned / Rented
    ownership_type: str = "Owned"

    # Used for Owned equipment
    purchase_date: date | None = None

    purchase_cost: float | None = None

    # Used for Rented equipment
    rental_rate: float | None = None

    # Hour / Day
    rental_rate_unit: str | None = None


# ==========================================================
# UPDATE EQUIPMENT
# ==========================================================

class EquipmentUpdate(BaseModel):

    equipment_name: str

    category: str

    manufacturer: str | None = None

    # Owned / Rented
    ownership_type: str

    # Used for Owned equipment
    purchase_date: date | None = None

    purchase_cost: float | None = None

    # Used for Rented equipment
    rental_rate: float | None = None

    # Hour / Day
    rental_rate_unit: str | None = None

    status: str


# ==========================================================
# RESPONSE
# ==========================================================

class EquipmentResponse(BaseModel):

    id: int

    equipment_code: str

    equipment_name: str

    category: str

    manufacturer: str | None

    ownership_type: str

    purchase_date: date | None

    purchase_cost: float | None

    rental_rate: float | None

    rental_rate_unit: str | None

    status: str

    model_config = {
        "from_attributes": True
    }
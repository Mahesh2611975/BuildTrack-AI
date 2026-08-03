from datetime import date

from pydantic import BaseModel


class EquipmentCreate(BaseModel):
    equipment_code: str
    equipment_name: str
    category: str
    manufacturer: str | None = None
    purchase_date: date | None = None
    purchase_cost: float | None = None


class EquipmentUpdate(BaseModel):
    equipment_name: str
    category: str
    manufacturer: str | None = None
    purchase_date: date | None = None
    purchase_cost: float | None = None
    status: str


class EquipmentResponse(BaseModel):
    id: int
    equipment_code: str
    equipment_name: str
    category: str
    manufacturer: str | None
    purchase_date: date | None
    purchase_cost: float | None
    status: str

    model_config = {
        "from_attributes": True
    }
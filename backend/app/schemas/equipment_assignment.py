from datetime import date

from pydantic import BaseModel


class EquipmentAssignmentCreate(BaseModel):
    equipment_id: int
    project_id: int
    assigned_date: date
    expected_return_date: date | None = None


class EquipmentAssignmentUpdate(BaseModel):
    expected_return_date: date | None = None
    status: str


class EquipmentAssignmentResponse(BaseModel):
    id: int
    equipment_id: int
    project_id: int
    assigned_date: date
    expected_return_date: date | None
    status: str

    model_config = {
        "from_attributes": True
    }
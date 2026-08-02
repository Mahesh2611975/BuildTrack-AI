from datetime import date
from pydantic import BaseModel


class MaterialReturnCreate(BaseModel):
    material_issue_id: int
    quantity: float
    return_date: date
    remarks: str | None = None


class MaterialReturnResponse(BaseModel):
    id: int
    material_issue_id: int
    quantity: float
    return_date: date
    remarks: str | None = None

    model_config = {
        "from_attributes": True
    }
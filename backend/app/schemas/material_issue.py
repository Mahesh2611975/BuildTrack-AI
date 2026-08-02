from datetime import date
from pydantic import BaseModel


class MaterialIssueCreate(BaseModel):
    material_id: int
    project_id: int
    quantity: float
    issue_date: date
    remarks: str | None = None


class MaterialIssueResponse(BaseModel):
    id: int
    material_id: int
    project_id: int
    quantity: float
    issue_date: date
    remarks: str | None

    model_config = {
        "from_attributes": True
    }
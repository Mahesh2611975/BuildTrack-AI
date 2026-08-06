from datetime import date
from pydantic import BaseModel


from typing import Optional

class ProjectCreate(BaseModel):
    project_id: Optional[str] = None
    project_name: str
    client_name: str
    location: str
    description: str
    start_date: date
    expected_end_date: date
    budget: float
    status: str
    contractor_id: int


class ProjectUpdate(BaseModel):
    project_name: str
    client_name: str
    location: str
    description: str
    start_date: date
    expected_end_date: date
    budget: float
    status: str
    contractor_id: int


class ProjectResponse(BaseModel):
    id: int
    project_id: str
    project_name: str
    client_name: str
    location: str
    description: str
    start_date: date
    expected_end_date: date
    budget: float
    status: str
    contractor_id: int

    model_config = {
        "from_attributes": True
    }
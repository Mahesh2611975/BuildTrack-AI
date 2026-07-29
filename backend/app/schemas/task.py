from datetime import date
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    priority: str
    start_date: date
    due_date: date
    project_id: int
    employee_id: int


class TaskUpdate(BaseModel):
    title: str
    description: str | None = None
    priority: str
    status: str
    start_date: date
    due_date: date
    project_id: int
    employee_id: int


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    priority: str
    status: str
    start_date: date
    due_date: date
    project_id: int
    employee_id: int

    model_config = {
        "from_attributes": True
    }
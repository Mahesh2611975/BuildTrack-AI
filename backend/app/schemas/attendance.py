from datetime import date

from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str

    model_config = {
        "from_attributes": True
    }
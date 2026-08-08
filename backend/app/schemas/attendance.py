from datetime import date
from typing import Literal

from pydantic import BaseModel


AttendanceStatus = Literal[
    "Present",
    "Absent",
    "Half Day",
    "Leave",
]


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: AttendanceStatus

    model_config = {
        "from_attributes": True,
    }
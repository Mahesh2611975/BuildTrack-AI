from datetime import date, time

from pydantic import BaseModel


class EquipmentWorkLogCreate(BaseModel):
    assignment_id: int
    work_date: date
    start_time: time
    end_time: time
    hourly_rate: float
    remarks: str | None = None


class EquipmentWorkLogResponse(BaseModel):
    id: int
    assignment_id: int
    work_date: date
    start_time: time
    end_time: time
    hourly_rate: float
    working_hours: float
    total_cost: float
    remarks: str | None

    model_config = {
        "from_attributes": True
    }
from datetime import date

from pydantic import (
    BaseModel,
    Field,
)


class AdvanceCreate(BaseModel):

    employee_id: int

    amount: float = Field(
        ...,
        gt=0,
    )

    advance_date: date

    reason: str | None = None


class AdvanceUpdate(BaseModel):

    amount: float = Field(
        ...,
        gt=0,
    )

    advance_date: date

    reason: str | None = None

    status: str


class AdvanceResponse(BaseModel):

    id: int

    advance_code: str

    employee_id: int

    amount: float

    remaining_amount: float

    advance_date: date

    reason: str | None

    status: str

    model_config = {
        "from_attributes": True
    }
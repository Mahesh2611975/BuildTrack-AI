from datetime import date

from pydantic import (
    BaseModel,
    Field,
)


class AdvanceTransactionCreate(BaseModel):

    employee_id: int

    # Optional link to a main advance.
    #
    # Usually for our daily advance system
    # this can remain None.

    advance_id: int | None = None

    amount: float = Field(
        ...,
        gt=0,
    )

    transaction_date: date

    reason: str | None = None


class AdvanceTransactionResponse(BaseModel):

    id: int

    employee_id: int

    advance_id: int | None

    amount: float

    transaction_date: date

    reason: str | None

    model_config = {
        "from_attributes": True
    }
from datetime import date

from pydantic import BaseModel, Field


# ==========================================================
# CREATE ADVANCE TRANSACTION
# ==========================================================

class AdvanceTransactionCreate(BaseModel):

    employee_id: int

    advance_id: int | None = None

    amount: float = Field(
        ...,
        gt=0,
    )

    transaction_date: date

    reason: str | None = None


# ==========================================================
# RESPONSE
# ==========================================================

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
from datetime import date

from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    expense_code: str
    project_id: int
    category: str
    amount: float
    expense_date: date
    description: str | None = None


class ExpenseUpdate(BaseModel):
    category: str
    amount: float
    expense_date: date
    description: str | None = None


class ExpenseResponse(BaseModel):
    id: int
    expense_code: str
    project_id: int
    category: str
    amount: float
    expense_date: date
    description: str | None

    model_config = {
        "from_attributes": True
    }
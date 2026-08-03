from pydantic import BaseModel


class BudgetDashboardResponse(BaseModel):
    project_budget: float
    total_expenses: float
    remaining_budget: float
    budget_used_percentage: float
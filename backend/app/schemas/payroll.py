from pydantic import BaseModel


class PayrollResponse(BaseModel):
    employee_name: str
    employee_id: str

    month: int
    year: int

    basic_salary: float
    hra: float
    allowance: float

    gross_salary: float

    present_days: int
    total_working_days: int

    earned_salary: float

    pf: float
    professional_tax: float

    total_deductions: float

    net_salary: float
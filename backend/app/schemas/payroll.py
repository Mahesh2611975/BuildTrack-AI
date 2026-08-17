from pydantic import BaseModel


class PayrollResponse(BaseModel):

    # ==========================================
    # EMPLOYEE
    # ==========================================

    employee_name: str
    employee_id: str

    # ==========================================
    # PAYROLL PERIOD
    # ==========================================

    month: int
    year: int

    # ==========================================
    # SALARY COMPONENTS
    # ==========================================

    basic_salary: float
    hra: float
    allowance: float

    gross_salary: float

    # ==========================================
    # ATTENDANCE
    # ==========================================

    total_working_days: int

    present_days: int
    half_days: int
    absent_days: int
    leave_days: int

    paid_days: float

    # ==========================================
    # SALARY CALCULATION
    # ==========================================

    daily_salary: float
    earned_salary: float

    # ==========================================
    # DEDUCTIONS
    # ==========================================

    pf: float
    professional_tax: float
    advance_deduction: float
    total_deductions: float

    # ==========================================
    # FINAL SALARY
    # ==========================================

    net_salary: float
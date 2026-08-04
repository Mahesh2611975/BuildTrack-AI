from pydantic import BaseModel


class SalaryStructureCreate(BaseModel):
    employee_id: int
    basic_salary: float
    hra: float = 0
    allowance: float = 0
    pf: float = 0
    professional_tax: float = 0


class SalaryStructureUpdate(BaseModel):
    basic_salary: float
    hra: float
    allowance: float
    pf: float
    professional_tax: float


class SalaryStructureResponse(BaseModel):
    id: int
    employee_id: int
    basic_salary: float
    hra: float
    allowance: float
    pf: float
    professional_tax: float

    model_config = {
        "from_attributes": True
    }
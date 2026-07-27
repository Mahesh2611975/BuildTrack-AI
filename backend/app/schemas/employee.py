from datetime import date
from pydantic import BaseModel, EmailStr


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    mobile_number: str
    email: EmailStr
    designation: str
    department: str
    salary: float
    joining_date: date


class EmployeeUpdate(BaseModel):
    full_name: str
    mobile_number: str
    email: EmailStr
    designation: str
    department: str
    salary: float
    joining_date: date
    is_active: bool


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    mobile_number: str
    email: str
    designation: str
    department: str
    salary: float
    joining_date: date
    is_active: bool

    model_config = {
        "from_attributes": True
    }
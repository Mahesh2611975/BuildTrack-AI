from datetime import date

from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    mobile_number: str = Field(
        ...,
        min_length=10,
        max_length=15,
    )

    email: EmailStr

    designation: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    department: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    salary: float = Field(
        ...,
        gt=0,
    )

    joining_date: date


class EmployeeUpdate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    mobile_number: str = Field(
        ...,
        min_length=10,
        max_length=15,
    )

    email: EmailStr

    designation: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    department: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    salary: float = Field(
        ...,
        gt=0,
    )

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
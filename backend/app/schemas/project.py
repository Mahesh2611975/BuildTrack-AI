from datetime import date
from typing import Optional

from pydantic import BaseModel, Field, model_validator


class ProjectCreate(BaseModel):

    project_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    client_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    location: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    start_date: date

    expected_end_date: date

    budget: float = Field(
        ...,
        gt=0,
    )

    status: str = Field(
        default="Planned",
        max_length=30,
    )

    contractor_id: int

    @model_validator(mode="after")
    def validate_dates(self):
        if self.expected_end_date < self.start_date:
            raise ValueError(
                "Expected end date cannot be before start date"
            )

        return self


class ProjectUpdate(BaseModel):

    project_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    client_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    location: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    start_date: date

    expected_end_date: date

    budget: float = Field(
        ...,
        gt=0,
    )

    status: str = Field(
        ...,
        max_length=30,
    )

    contractor_id: int

    @model_validator(mode="after")
    def validate_dates(self):
        if self.expected_end_date < self.start_date:
            raise ValueError(
                "Expected end date cannot be before start date"
            )

        return self


class ProjectResponse(BaseModel):

    id: int

    project_id: str

    project_name: str

    client_name: str

    location: str

    description: Optional[str]

    start_date: date

    expected_end_date: date

    budget: float

    status: str

    contractor_id: int

    model_config = {
        "from_attributes": True
    }
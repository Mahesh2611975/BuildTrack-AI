from typing import Optional

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)


class ContractorCreate(BaseModel):

    company_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    contractor_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    mobile_number: str = Field(
        ...,
        min_length=10,
        max_length=15,
    )

    email: Optional[EmailStr] = None

    address: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    licence_number: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    gst_number: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    experience_years: int = Field(
        default=0,
        ge=0,
    )


class ContractorUpdate(BaseModel):

    company_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    contractor_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    mobile_number: str = Field(
        ...,
        min_length=10,
        max_length=15,
    )

    email: Optional[EmailStr] = None

    address: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    licence_number: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    gst_number: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    experience_years: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class ContractorResponse(BaseModel):

    id: int

    contractor_id: str

    company_name: str

    contractor_name: str

    mobile_number: str

    email: Optional[str]

    address: Optional[str]

    licence_number: Optional[str]

    gst_number: Optional[str]

    experience_years: int

    is_active: bool

    model_config = {
        "from_attributes": True
    }
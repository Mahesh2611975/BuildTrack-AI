from pydantic import BaseModel, EmailStr


class ContractorCreate(BaseModel):
    contractor_id: str
    company_name: str
    contractor_name: str
    mobile_number: str
    email: EmailStr
    address: str
    licence_number: str
    gst_number: str
    experience_years: int


class ContractorUpdate(BaseModel):
    company_name: str
    contractor_name: str
    mobile_number: str
    email: EmailStr
    address: str
    licence_number: str
    gst_number: str
    experience_years: int
    is_active: bool


class ContractorResponse(BaseModel):
    id: int
    contractor_id: str
    company_name: str
    contractor_name: str
    mobile_number: str
    email: str
    address: str
    licence_number: str
    gst_number: str
    experience_years: int
    is_active: bool

    model_config = {
        "from_attributes": True
    }
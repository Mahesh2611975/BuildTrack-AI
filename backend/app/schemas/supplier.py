from pydantic import BaseModel, EmailStr


class SupplierCreate(BaseModel):
    supplier_code: str
    company_name: str
    contact_person: str
    mobile_number: str
    email: EmailStr | None = None
    address: str | None = None
    gst_number: str | None = None


class SupplierUpdate(BaseModel):
    company_name: str
    contact_person: str
    mobile_number: str
    email: EmailStr | None = None
    address: str | None = None
    gst_number: str | None = None
    is_active: bool


class SupplierResponse(BaseModel):
    id: int
    supplier_code: str
    company_name: str
    contact_person: str
    mobile_number: str
    email: str | None
    address: str | None
    gst_number: str | None
    is_active: bool

    model_config = {
        "from_attributes": True
    }
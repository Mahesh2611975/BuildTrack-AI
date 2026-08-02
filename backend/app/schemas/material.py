from pydantic import BaseModel


class MaterialCreate(BaseModel):
    material_code: str
    material_name: str
    category: str
    unit: str
    quantity: float
    unit_price: float
    supplier: str | None = None


class MaterialUpdate(BaseModel):
    material_name: str
    category: str
    unit: str
    quantity: float
    unit_price: float
    supplier: str | None = None


class MaterialResponse(BaseModel):
    id: int
    material_code: str
    material_name: str
    category: str
    unit: str
    quantity: float
    unit_price: float
    supplier: str | None

    model_config = {
        "from_attributes": True
    }
from datetime import date
from pydantic import BaseModel


class PurchaseOrderCreate(BaseModel):
    po_number: str
    supplier_name: str
    material_id: int
    quantity: float
    unit_price: float
    order_date: date
    expected_delivery_date: date


class PurchaseOrderUpdate(BaseModel):
    status: str


class PurchaseOrderResponse(BaseModel):
    id: int
    po_number: str
    supplier_name: str
    material_id: int
    quantity: float
    unit_price: float
    total_amount: float
    order_date: date
    expected_delivery_date: date
    status: str

    model_config = {
        "from_attributes": True
    }
from sqlalchemy.orm import Session

from app.models.purchase_order import PurchaseOrder

from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
)

from app.repository.purchase_order_repository import (
    PurchaseOrderRepository,
)
from app.repository.material_repository import MaterialRepository


class PurchaseOrderService:

    @staticmethod
    def create_purchase_order(
        db: Session,
        request: PurchaseOrderCreate,
    ):
        purchase_order = PurchaseOrder(
            po_number=request.po_number,
            supplier_name=request.supplier_name,
            material_id=request.material_id,
            quantity=request.quantity,
            unit_price=request.unit_price,
            total_amount=request.quantity * request.unit_price,
            order_date=request.order_date,
            expected_delivery_date=request.expected_delivery_date,
            status="Pending",
        )

        return PurchaseOrderRepository.create_purchase_order(
            db,
            purchase_order,
        )

    @staticmethod
    def get_all_purchase_orders(
        db: Session,
    ):
        return PurchaseOrderRepository.get_all_purchase_orders(db)

    @staticmethod
    def update_purchase_order(
        db: Session,
        purchase_order_id: int,
        request: PurchaseOrderUpdate,
    ):
        purchase_order = (
            PurchaseOrderRepository.get_purchase_order_by_id(
                db,
                purchase_order_id,
            )
        )

        if purchase_order is None:
            return None

        purchase_order.status = request.status

        # Increase stock only when delivered
        if request.status == "Delivered":
            material = MaterialRepository.get_material_by_id(
                db,
                purchase_order.material_id,
            )

            if material:
                material.quantity += purchase_order.quantity
                MaterialRepository.update_material(
                    db,
                    material,
                )

        return PurchaseOrderRepository.update_purchase_order(
            db,
            purchase_order,
        )
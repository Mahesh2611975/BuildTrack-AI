from sqlalchemy.orm import Session

from app.models.purchase_order import PurchaseOrder


class PurchaseOrderRepository:

    @staticmethod
    def create_purchase_order(
        db: Session,
        purchase_order: PurchaseOrder,
    ):
        db.add(purchase_order)
        db.commit()
        db.refresh(purchase_order)
        return purchase_order

    @staticmethod
    def get_all_purchase_orders(
        db: Session,
    ):
        return db.query(PurchaseOrder).all()

    @staticmethod
    def get_purchase_order_by_id(
        db: Session,
        purchase_order_id: int,
    ):
        return (
            db.query(PurchaseOrder)
            .filter(PurchaseOrder.id == purchase_order_id)
            .first()
        )

    @staticmethod
    def update_purchase_order(
        db: Session,
        purchase_order: PurchaseOrder,
    ):
        db.commit()
        db.refresh(purchase_order)
        return purchase_order
from sqlalchemy.orm import Session

from app.models.supplier import Supplier


class SupplierRepository:

    @staticmethod
    def create_supplier(
        db: Session,
        supplier: Supplier,
    ):
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier

    @staticmethod
    def get_all_suppliers(
        db: Session,
    ):
        return db.query(Supplier).all()

    @staticmethod
    def get_supplier_by_id(
        db: Session,
        supplier_id: int,
    ):
        return (
            db.query(Supplier)
            .filter(Supplier.id == supplier_id)
            .first()
        )

    @staticmethod
    def update_supplier(
        db: Session,
        supplier: Supplier,
    ):
        db.commit()
        db.refresh(supplier)
        return supplier

    @staticmethod
    def delete_supplier(
        db: Session,
        supplier: Supplier,
    ):
        db.delete(supplier)
        db.commit()
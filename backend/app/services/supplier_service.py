from sqlalchemy.orm import Session

from app.models.supplier import Supplier

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
)

from app.repository.supplier_repository import (
    SupplierRepository,
)


class SupplierService:

    @staticmethod
    def create_supplier(
        db: Session,
        request: SupplierCreate,
    ):
        supplier = Supplier(
            supplier_code=request.supplier_code,
            company_name=request.company_name,
            contact_person=request.contact_person,
            mobile_number=request.mobile_number,
            email=request.email,
            address=request.address,
            gst_number=request.gst_number,
            is_active=True,
        )

        return SupplierRepository.create_supplier(
            db,
            supplier,
        )

    @staticmethod
    def get_all_suppliers(
        db: Session,
    ):
        return SupplierRepository.get_all_suppliers(db)

    @staticmethod
    def update_supplier(
        db: Session,
        supplier_id: int,
        request: SupplierUpdate,
    ):
        supplier = SupplierRepository.get_supplier_by_id(
            db,
            supplier_id,
        )

        if supplier is None:
            return None

        supplier.company_name = request.company_name
        supplier.contact_person = request.contact_person
        supplier.mobile_number = request.mobile_number
        supplier.email = request.email
        supplier.address = request.address
        supplier.gst_number = request.gst_number
        supplier.is_active = request.is_active

        return SupplierRepository.update_supplier(
            db,
            supplier,
        )

    @staticmethod
    def delete_supplier(
        db: Session,
        supplier_id: int,
    ):
        supplier = SupplierRepository.get_supplier_by_id(
            db,
            supplier_id,
        )

        if supplier is None:
            return None

        SupplierRepository.delete_supplier(
            db,
            supplier,
        )

        return True
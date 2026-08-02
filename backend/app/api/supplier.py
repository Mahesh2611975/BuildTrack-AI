from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
)

from app.services.supplier_service import (
    SupplierService,
)

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


@router.post(
    "/",
    response_model=SupplierResponse,
)
def create_supplier(
    request: SupplierCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return SupplierService.create_supplier(db, request)


@router.get(
    "/",
    response_model=list[SupplierResponse],
)
def get_all_suppliers(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return SupplierService.get_all_suppliers(db)


@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def update_supplier(
    supplier_id: int,
    request: SupplierUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    supplier = SupplierService.update_supplier(
        db,
        supplier_id,
        request,
    )

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return supplier


@router.delete(
    "/{supplier_id}",
)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    deleted = SupplierService.delete_supplier(
        db,
        supplier_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return {
        "message": "Supplier deleted successfully"
    }
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderResponse,
)

from app.services.purchase_order_service import (
    PurchaseOrderService,
)

router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"],
)


@router.post(
    "/",
    response_model=PurchaseOrderResponse,
)
def create_purchase_order(
    request: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return PurchaseOrderService.create_purchase_order(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[PurchaseOrderResponse],
)
def get_all_purchase_orders(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return PurchaseOrderService.get_all_purchase_orders(db)


@router.put(
    "/{purchase_order_id}",
    response_model=PurchaseOrderResponse,
)
def update_purchase_order(
    purchase_order_id: int,
    request: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    purchase_order = (
        PurchaseOrderService.update_purchase_order(
            db,
            purchase_order_id,
            request,
        )
    )

    if purchase_order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found",
        )

    return purchase_order
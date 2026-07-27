from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import LoginRequest, Token
from app.services.auth_service import authenticate_admin
from app.auth.jwt import create_access_token
from app.auth.dependencies import get_current_admin
from app.models.admin import Admin

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login", response_model=Token)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    admin = authenticate_admin(
        db,
        request.username,
        request.password
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        {
            "sub": admin.username
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_admin: Admin = Depends(get_current_admin)):
    return {
        "id": current_admin.id,
        "username": current_admin.username,
        "full_name": current_admin.full_name,
        "mobile_number": current_admin.mobile_number,
        "role": current_admin.role,
        "is_active": current_admin.is_active
    }
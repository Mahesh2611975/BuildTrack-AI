from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.auth.password import verify_password


def authenticate_admin(
    db: Session,
    username: str,
    password: str
):
    admin = (
        db.query(Admin)
        .filter(Admin.username == username)
        .first()
    )

    if not admin:
        return None

    if not verify_password(password, admin.password_hash):
        return None

    return admin
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
)

from app.services.attendance_service import AttendanceService

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


@router.post(
    "/",
    response_model=AttendanceResponse,
)
def mark_attendance(
    request: AttendanceCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return AttendanceService.mark_attendance(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[AttendanceResponse],
)
def get_all_attendance(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return AttendanceService.get_all_attendance(db)


@router.get(
    "/employee/{employee_id}",
    response_model=list[AttendanceResponse],
)
def get_employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return AttendanceService.get_employee_attendance(
        db,
        employee_id,
    )
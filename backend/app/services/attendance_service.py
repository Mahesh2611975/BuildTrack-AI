from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate
from app.repository.attendance_repository import AttendanceRepository


class AttendanceService:

    @staticmethod
    def mark_attendance(
        db: Session,
        request: AttendanceCreate,
    ):
        attendance = Attendance(
            employee_id=request.employee_id,
            date=request.date,
            status=request.status,
        )

        return AttendanceRepository.mark_attendance(
            db,
            attendance,
        )

    @staticmethod
    def get_all_attendance(
        db: Session,
    ):
        return AttendanceRepository.get_all_attendance(db)

    @staticmethod
    def get_employee_attendance(
        db: Session,
        employee_id: int,
    ):
        return AttendanceRepository.get_employee_attendance(
            db,
            employee_id,
        )
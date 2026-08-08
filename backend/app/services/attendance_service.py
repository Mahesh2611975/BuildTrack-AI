from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employee import Employee

from app.schemas.attendance import AttendanceCreate

from app.repository.attendance_repository import (
    AttendanceRepository,
)

from app.core.exceptions import (
    BadRequestException,
)


class AttendanceService:

    @staticmethod
    def mark_attendance(
        db: Session,
        request: AttendanceCreate,
    ):

        # -----------------------------------------
        # Check employee exists
        # -----------------------------------------

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == request.employee_id
            )
            .first()
        )

        if not employee:

            raise BadRequestException(
                "Employee not found."
            )

        # -----------------------------------------
        # Check duplicate attendance
        # -----------------------------------------

        existing_attendance = (
            AttendanceRepository
            .get_attendance_by_employee_and_date(
                db,
                request.employee_id,
                request.date,
            )
        )

        if existing_attendance:

            raise BadRequestException(
                "Attendance already marked for this employee on this date."
            )

        # -----------------------------------------
        # Create attendance
        # -----------------------------------------

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
        return (
            AttendanceRepository
            .get_all_attendance(db)
        )

    @staticmethod
    def get_employee_attendance(
        db: Session,
        employee_id: int,
    ):
        return (
            AttendanceRepository
            .get_employee_attendance(
                db,
                employee_id,
            )
        )
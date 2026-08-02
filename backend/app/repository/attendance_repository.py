from sqlalchemy.orm import Session

from app.models.attendance import Attendance


class AttendanceRepository:

    @staticmethod
    def mark_attendance(
        db: Session,
        attendance: Attendance,
    ):
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
        return attendance

    @staticmethod
    def get_all_attendance(
        db: Session,
    ):
        return db.query(Attendance).all()

    @staticmethod
    def get_employee_attendance(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(Attendance)
            .filter(Attendance.employee_id == employee_id)
            .all()
        )
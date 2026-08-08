from sqlalchemy.orm import Session
from sqlalchemy import extract

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
        return (
            db.query(Attendance)
            .order_by(
                Attendance.date.desc(),
                Attendance.id.desc(),
            )
            .all()
        )

    @staticmethod
    def get_employee_attendance(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id
            )
            .order_by(
                Attendance.date.desc(),
                Attendance.id.desc(),
            )
            .all()
        )

    @staticmethod
    def get_attendance_by_employee_and_date(
        db: Session,
        employee_id: int,
        attendance_date,
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                Attendance.date == attendance_date,
            )
            .first()
        )

    @staticmethod
    def count_present_days(
        db: Session,
        employee_id: int,
        year: int,
        month: int,
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                Attendance.status == "Present",
                extract(
                    "year",
                    Attendance.date,
                ) == year,
                extract(
                    "month",
                    Attendance.date,
                ) == month,
            )
            .count()
        )
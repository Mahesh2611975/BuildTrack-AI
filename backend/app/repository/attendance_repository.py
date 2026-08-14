from sqlalchemy.orm import Session
from sqlalchemy import extract

from app.models.attendance import Attendance


class AttendanceRepository:

    # =====================================================
    # MARK ATTENDANCE
    # =====================================================

    @staticmethod
    def mark_attendance(
        db: Session,
        attendance: Attendance,
    ):
        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        return attendance

    # =====================================================
    # GET ALL ATTENDANCE
    # =====================================================

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

    # =====================================================
    # GET EMPLOYEE ATTENDANCE
    # =====================================================

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
                Attendance.date.desc()
            )
            .all()
        )

    # =====================================================
    # GET ATTENDANCE BY EMPLOYEE AND DATE
    # =====================================================

    @staticmethod
    def get_attendance_by_employee_and_date(
        db: Session,
        employee_id: int,
        date,
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                Attendance.date == date,
            )
            .first()
        )

    # =====================================================
    # COUNT PRESENT DAYS
    # =====================================================

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

    # =====================================================
    # MONTHLY ATTENDANCE SUMMARY
    # =====================================================

    @staticmethod
    def get_monthly_attendance_summary(
        db: Session,
        employee_id: int,
        year: int,
        month: int,
    ):

        records = (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,
                extract(
                    "year",
                    Attendance.date,
                ) == year,
                extract(
                    "month",
                    Attendance.date,
                ) == month,
            )
            .all()
        )

        present_days = 0
        half_days = 0
        absent_days = 0
        leave_days = 0

        for record in records:

            if record.status == "Present":
                present_days += 1

            elif record.status == "Half Day":
                half_days += 1

            elif record.status == "Absent":
                absent_days += 1

            elif record.status == "Leave":
                leave_days += 1

        return {
            "present_days": present_days,
            "half_days": half_days,
            "absent_days": absent_days,
            "leave_days": leave_days,
        }
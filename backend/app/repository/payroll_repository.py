from sqlalchemy.orm import Session

from app.models.payroll import Payroll


class PayrollRepository:

    # =====================================================
    # CREATE PAYROLL
    # =====================================================

    @staticmethod
    def create_payroll(
        db: Session,
        payroll: Payroll,
    ):

        db.add(payroll)

        db.commit()

        db.refresh(payroll)

        return payroll

    # =====================================================
    # GET ALL PAYROLL
    # =====================================================

    @staticmethod
    def get_all_payroll(
        db: Session,
    ):

        return (
            db.query(Payroll)
            .order_by(
                Payroll.year.desc(),
                Payroll.month.desc(),
                Payroll.id.desc(),
            )
            .all()
        )

    # =====================================================
    # GET PAYROLL BY ID
    # =====================================================

    @staticmethod
    def get_payroll_by_id(
        db: Session,
        payroll_id: int,
    ):

        return (
            db.query(Payroll)
            .filter(
                Payroll.id == payroll_id
            )
            .first()
        )

    # =====================================================
    # GET EMPLOYEE PAYROLL HISTORY
    # =====================================================

    @staticmethod
    def get_employee_payroll(
        db: Session,
        employee_id: int,
    ):

        return (
            db.query(Payroll)
            .filter(
                Payroll.employee_id == employee_id
            )
            .order_by(
                Payroll.year.desc(),
                Payroll.month.desc(),
                Payroll.id.desc(),
            )
            .all()
        )

    # =====================================================
    # GET PAYROLL FOR SPECIFIC MONTH
    # =====================================================

    @staticmethod
    def get_monthly_payroll(
        db: Session,
        employee_id: int,
        year: int,
        month: int,
    ):

        return (
            db.query(Payroll)
            .filter(
                Payroll.employee_id == employee_id,
                Payroll.year == year,
                Payroll.month == month,
            )
            .first()
        )

    # =====================================================
    # DELETE PAYROLL
    # =====================================================

    @staticmethod
    def delete_payroll(
        db: Session,
        payroll_id: int,
    ):

        payroll = (
            db.query(Payroll)
            .filter(
                Payroll.id == payroll_id
            )
            .first()
        )

        if payroll is None:
            return None

        db.delete(payroll)

        db.commit()

        return payroll
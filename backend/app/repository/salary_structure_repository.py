from sqlalchemy.orm import Session

from app.models.salary_structure import SalaryStructure


class SalaryStructureRepository:

    @staticmethod
    def create_salary_structure(
        db: Session,
        salary: SalaryStructure,
    ):
        db.add(salary)
        db.commit()
        db.refresh(salary)
        return salary

    @staticmethod
    def get_all_salary_structures(
        db: Session,
    ):
        return db.query(SalaryStructure).all()

    @staticmethod
    def get_salary_by_employee(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(SalaryStructure)
            .filter(
                SalaryStructure.employee_id == employee_id
            )
            .first()
        )

    @staticmethod
    def update_salary(
        db: Session,
        salary: SalaryStructure,
    ):
        db.commit()
        db.refresh(salary)
        return salary

    @staticmethod
    def delete_salary(
        db: Session,
        salary: SalaryStructure,
    ):
        db.delete(salary)
        db.commit()
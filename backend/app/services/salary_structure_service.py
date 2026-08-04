from sqlalchemy.orm import Session

from app.models.salary_structure import SalaryStructure

from app.schemas.salary_structure import (
    SalaryStructureCreate,
    SalaryStructureUpdate,
)

from app.repository.salary_structure_repository import (
    SalaryStructureRepository,
)


class SalaryStructureService:

    @staticmethod
    def create_salary_structure(
        db: Session,
        request: SalaryStructureCreate,
    ):
        existing = (
            SalaryStructureRepository.get_salary_by_employee(
                db,
                request.employee_id,
            )
        )

        if existing:
            return None

        salary = SalaryStructure(
            employee_id=request.employee_id,
            basic_salary=request.basic_salary,
            hra=request.hra,
            allowance=request.allowance,
            pf=request.pf,
            professional_tax=request.professional_tax,
        )

        return (
            SalaryStructureRepository.create_salary_structure(
                db,
                salary,
            )
        )

    @staticmethod
    def get_all_salary_structures(
        db: Session,
    ):
        return (
            SalaryStructureRepository.get_all_salary_structures(
                db,
            )
        )

    @staticmethod
    def update_salary(
        db: Session,
        employee_id: int,
        request: SalaryStructureUpdate,
    ):
        salary = (
            SalaryStructureRepository.get_salary_by_employee(
                db,
                employee_id,
            )
        )

        if salary is None:
            return None

        salary.basic_salary = request.basic_salary
        salary.hra = request.hra
        salary.allowance = request.allowance
        salary.pf = request.pf
        salary.professional_tax = request.professional_tax

        return (
            SalaryStructureRepository.update_salary(
                db,
                salary,
            )
        )
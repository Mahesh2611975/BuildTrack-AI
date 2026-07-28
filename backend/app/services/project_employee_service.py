from sqlalchemy.orm import Session

from app.repository.project_employee_repository import (
    ProjectEmployeeRepository,
)


class ProjectEmployeeService:

    @staticmethod
    def assign_employee(
        db: Session,
        project_id: int,
        employee_id: int,
    ):
        return ProjectEmployeeRepository.assign_employee(
            db,
            project_id,
            employee_id,
        )

    @staticmethod
    def get_project_employees(
        db: Session,
        project_id: int,
    ):
        return ProjectEmployeeRepository.get_project_employees(
            db,
            project_id,
        )

    @staticmethod
    def remove_employee(
        db: Session,
        project_id: int,
        employee_id: int,
    ):
        return ProjectEmployeeRepository.remove_employee(
            db,
            project_id,
            employee_id,
        )
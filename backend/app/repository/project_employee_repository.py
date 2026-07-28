from sqlalchemy.orm import Session

from app.models.project_employee import ProjectEmployee


class ProjectEmployeeRepository:

    @staticmethod
    def assign_employee(
        db: Session,
        project_id: int,
        employee_id: int,
    ):
        assignment = ProjectEmployee(
            project_id=project_id,
            employee_id=employee_id,
        )

        db.add(assignment)
        db.commit()
        db.refresh(assignment)

        return assignment

    @staticmethod
    def get_project_employees(
        db: Session,
        project_id: int,
    ):
        return (
            db.query(ProjectEmployee)
            .filter(ProjectEmployee.project_id == project_id)
            .all()
        )

    @staticmethod
    def remove_employee(
        db: Session,
        project_id: int,
        employee_id: int,
    ):
        assignment = (
            db.query(ProjectEmployee)
            .filter(
                ProjectEmployee.project_id == project_id,
                ProjectEmployee.employee_id == employee_id,
            )
            .first()
        )

        if assignment:
            db.delete(assignment)
            db.commit()

        return assignment
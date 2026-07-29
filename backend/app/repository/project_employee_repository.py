from sqlalchemy.orm import Session

from app.models.project_employee import ProjectEmployee


class ProjectEmployeeRepository:

    @staticmethod
    def assign_employee(
        db: Session,
        project_id: int,
        employee_id: int,
    ):
        # Check if the employee is already assigned to this project
        existing_assignment = (
            db.query(ProjectEmployee)
            .filter(
                ProjectEmployee.project_id == project_id,
                ProjectEmployee.employee_id == employee_id,
            )
            .first()
        )

        if existing_assignment:
            return None

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
            assignments = (
                db.query(ProjectEmployee)
                .filter(ProjectEmployee.project_id == project_id)
                .all()
            )

            employees = []

            for assignment in assignments:
                employee = assignment.employee

                employees.append(
                    {
                        "id": employee.id,
                        "employee_id": employee.employee_id,
                        "full_name": employee.full_name,
                        "mobile_number": employee.mobile_number,
                        "email": employee.email,
                        "designation": employee.designation,
                        "department": employee.department,
                    }
                )

            return employees

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
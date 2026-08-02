from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.employee import Employee
from app.models.task import Task


class DashboardRepository:

    @staticmethod
    def get_dashboard_data(db: Session):
        total_projects = db.query(func.count(Project.id)).scalar()

        total_employees = db.query(func.count(Employee.id)).scalar()

        total_tasks = db.query(func.count(Task.id)).scalar()

        pending_tasks = (
            db.query(func.count(Task.id))
            .filter(Task.status == "Pending")
            .scalar()
        )

        in_progress_tasks = (
            db.query(func.count(Task.id))
            .filter(Task.status == "In Progress")
            .scalar()
        )

        completed_tasks = (
            db.query(func.count(Task.id))
            .filter(Task.status == "Completed")
            .scalar()
        )

        return {
            "total_projects": total_projects,
            "total_employees": total_employees,
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completed_tasks": completed_tasks,
        }
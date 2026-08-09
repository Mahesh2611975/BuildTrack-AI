from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.project import Project


def generate_management_summary(db: Session):

    # =====================================================
    # EMPLOYEE SUMMARY
    # =====================================================

    total_employees = (
        db.query(Employee)
        .count()
    )

    active_employees = (
        db.query(Employee)
        .filter(
            Employee.is_active == True
        )
        .count()
    )

    inactive_employees = (
        db.query(Employee)
        .filter(
            Employee.is_active == False
        )
        .count()
    )

    # =====================================================
    # PROJECT SUMMARY
    # =====================================================

    total_projects = (
        db.query(Project)
        .count()
    )

    planned_projects = (
        db.query(Project)
        .filter(
            Project.status == "Planned"
        )
        .count()
    )

    in_progress_projects = (
        db.query(Project)
        .filter(
            Project.status == "In Progress"
        )
        .count()
    )

    completed_projects = (
        db.query(Project)
        .filter(
            Project.status == "Completed"
        )
        .count()
    )

    # =====================================================
    # PROJECT BUDGET
    # =====================================================

    projects = (
        db.query(Project)
        .all()
    )

    total_project_budget = sum(
        project.budget or 0
        for project in projects
    )

    # =====================================================
    # RETURN SUMMARY
    # =====================================================

    return {

        "employees": {
            "total": total_employees,
            "active": active_employees,
            "inactive": inactive_employees,
        },

        "projects": {
            "total": total_projects,
            "planned": planned_projects,
            "in_progress": in_progress_projects,
            "completed": completed_projects,
            "total_budget": round(
                total_project_budget,
                2,
            ),
        },
    }
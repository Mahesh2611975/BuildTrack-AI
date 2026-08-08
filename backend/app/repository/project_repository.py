from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectRepository:

    @staticmethod
    def create_project(
        db: Session,
        project: ProjectCreate,
    ):

        # Find the latest project
        last_project = (
            db.query(Project)
            .order_by(Project.id.desc())
            .first()
        )

        # Generate project ID
        if last_project and last_project.project_id:

            try:
                last_number = int(
                    last_project.project_id.replace(
                        "PRJ",
                        ""
                    )
                )

            except ValueError:
                last_number = last_project.id

            new_project_id = (
                f"PRJ{last_number + 1:03d}"
            )

        else:
            new_project_id = "PRJ001"

        # Convert Pydantic model to dictionary
        project_data = project.model_dump()

        # Add generated project ID
        project_data["project_id"] = new_project_id

        # Create SQLAlchemy object
        db_project = Project(
            **project_data
        )

        db.add(db_project)

        db.commit()

        db.refresh(db_project)

        return db_project

    @staticmethod
    def get_all_projects(
        db: Session,
    ):

        return (
            db.query(Project)
            .order_by(Project.id.desc())
            .all()
        )

    @staticmethod
    def get_project_by_id(
        db: Session,
        project_id: int,
    ):

        return (
            db.query(Project)
            .filter(
                Project.id == project_id
            )
            .first()
        )

    @staticmethod
    def update_project(
        db: Session,
        project_id: int,
        project: ProjectUpdate,
    ):

        db_project = (
            db.query(Project)
            .filter(
                Project.id == project_id
            )
            .first()
        )

        if not db_project:
            return None

        update_data = project.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():

            setattr(
                db_project,
                key,
                value,
            )

        db.commit()

        db.refresh(db_project)

        return db_project

    @staticmethod
    def delete_project(
        db: Session,
        project_id: int,
    ):

        db_project = (
            db.query(Project)
            .filter(
                Project.id == project_id
            )
            .first()
        )

        if not db_project:
            return None

        db.delete(db_project)

        db.commit()

        return db_project
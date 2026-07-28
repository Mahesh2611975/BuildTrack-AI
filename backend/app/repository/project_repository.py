from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectRepository:

    @staticmethod
    def create_project(db: Session, project: ProjectCreate):
        db_project = Project(**project.model_dump())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def get_all_projects(db: Session):
        return db.query(Project).all()

    @staticmethod
    def get_project_by_id(db: Session, project_id: int):
        return db.query(Project).filter(Project.id == project_id).first()

    @staticmethod
    def update_project(db: Session, project_id: int, project: ProjectUpdate):
        db_project = db.query(Project).filter(Project.id == project_id).first()

        if not db_project:
            return None

        for key, value in project.model_dump().items():
            setattr(db_project, key, value)

        db.commit()
        db.refresh(db_project)

        return db_project

    @staticmethod
    def delete_project(db: Session, project_id: int):
        db_project = db.query(Project).filter(Project.id == project_id).first()

        if not db_project:
            return None

        db.delete(db_project)
        db.commit()

        return db_project
from sqlalchemy.orm import Session

from app.repository.project_repository import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectService:

    # ==========================================================
    # CREATE PROJECT
    # ==========================================================

    @staticmethod
    def create_project(
        db: Session,
        project: ProjectCreate,
    ):
        return ProjectRepository.create_project(
            db,
            project,
        )

    # ==========================================================
    # GET ALL PROJECTS
    # ==========================================================

    @staticmethod
    def get_all_projects(
        db: Session,
    ):
        return ProjectRepository.get_all_projects(
            db
        )

    # ==========================================================
    # GET PROJECT BY ID
    # ==========================================================

    @staticmethod
    def get_project_by_id(
        db: Session,
        project_id: int,
    ):
        return ProjectRepository.get_project_by_id(
            db,
            project_id,
        )

    # ==========================================================
    # UPDATE PROJECT
    # ==========================================================

    @staticmethod
    def update_project(
        db: Session,
        project_id: int,
        project: ProjectUpdate,
    ):
        return ProjectRepository.update_project(
            db,
            project_id,
            project,
        )

    # ==========================================================
    # DELETE PROJECT
    # ==========================================================

    @staticmethod
    def delete_project(
        db: Session,
        project_id: int,
    ):
        return ProjectRepository.delete_project(
            db,
            project_id,
        )
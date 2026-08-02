from sqlalchemy.orm import Session

from app.repository.project_summary_repository import (
    ProjectSummaryRepository,
)


class ProjectSummaryService:

    @staticmethod
    def get_summary(db: Session):
        return ProjectSummaryRepository.get_summary(db)
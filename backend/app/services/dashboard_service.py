from sqlalchemy.orm import Session

from app.repository.dashboard_repository import DashboardRepository


class DashboardService:

    @staticmethod
    def get_dashboard_data(db: Session):
        return DashboardRepository.get_dashboard_data(db)
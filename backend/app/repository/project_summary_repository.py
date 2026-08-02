from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.employee import Employee
from app.models.contractor import Contractor
from app.models.supplier import Supplier
from app.models.material import Material
from app.models.task import Task
from app.models.purchase_order import PurchaseOrder


class ProjectSummaryRepository:

    @staticmethod
    def get_summary(db: Session):
        return {
            "total_projects": db.query(Project).count(),
            "total_employees": db.query(Employee).count(),
            "total_contractors": db.query(Contractor).count(),
            "total_suppliers": db.query(Supplier).count(),
            "total_materials": db.query(Material).count(),
            "total_tasks": db.query(Task).count(),
            "pending_tasks": db.query(Task).filter(Task.status == "Pending").count(),
            "completed_tasks": db.query(Task).filter(Task.status == "Completed").count(),
            "in_progress_tasks": db.query(Task).filter(Task.status == "In Progress").count(),
            "purchase_orders": db.query(PurchaseOrder).count(),
        }
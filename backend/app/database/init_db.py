from app.database.base import Base
from app.database.connection import engine

# Import all models so SQLAlchemy knows about them
from app.models.admin import Admin
from app.models.employee import Employee
from app.models.contractor import Contractor
from app.models.project import Project
from app.models.project_employee import ProjectEmployee
from app.models.task import Task
from app.models.attendance import Attendance
from app.models.material import Material
from app.models.material_issue import MaterialIssue
from app.models.material_return import MaterialReturn
from app.models.purchase_order import PurchaseOrder
from app.models.supplier import Supplier
from app.models.expense import Expense
from app.models.advance import Advance
from app.models.equipment import Equipment
from app.models.equipment_assignment import EquipmentAssignment
from app.models.equipment_work_log import EquipmentWorkLog
from app.models.salary_structure import SalaryStructure
from app.models.payroll import Payroll


def init_db():

    print("Creating missing database tables...")

    Base.metadata.create_all(
        bind=engine
    )

    print("Database tables checked successfully.")
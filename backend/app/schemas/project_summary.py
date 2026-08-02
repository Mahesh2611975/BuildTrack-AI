from pydantic import BaseModel


class ProjectSummaryResponse(BaseModel):
    total_projects: int
    total_employees: int
    total_contractors: int
    total_suppliers: int
    total_materials: int
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    purchase_orders: int
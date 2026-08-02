from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_projects: int
    total_employees: int
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
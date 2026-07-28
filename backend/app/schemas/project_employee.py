from pydantic import BaseModel


class AssignEmployeeRequest(BaseModel):
    employee_id: int


class ProjectEmployeeResponse(BaseModel):
    id: int
    project_id: int
    employee_id: int

    model_config = {
        "from_attributes": True
    }
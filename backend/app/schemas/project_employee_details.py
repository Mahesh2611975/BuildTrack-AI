from pydantic import BaseModel


class ProjectEmployeeDetailsResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    mobile_number: str
    email: str
    designation: str
    department: str

    model_config = {
        "from_attributes": True
    }
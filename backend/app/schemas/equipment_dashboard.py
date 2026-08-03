from pydantic import BaseModel


class EquipmentDashboardResponse(BaseModel):
    total_equipment: int
    available_equipment: int
    in_use_equipment: int
    maintenance_equipment: int
    total_working_hours: float
    total_equipment_cost: float
from pydantic import BaseModel

class AlertCreate(BaseModel):

    alert_type: str
    severity: str
    source_ip: str
    destination_ip: str
    description: str
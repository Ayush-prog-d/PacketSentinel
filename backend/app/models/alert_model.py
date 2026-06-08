from sqlalchemy import Column, Integer, String

from app.database.database import Base

class Alert(Base):

    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    alert_type = Column(String)
    severity = Column(String)
    source_ip = Column(String)
    destination_ip = Column(String)
    description = Column(String)
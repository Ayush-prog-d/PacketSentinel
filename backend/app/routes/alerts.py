from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.alert_model import Alert
from app.schemas.alert_schema import AlertCreate
from app.storage import alerts_db

router = APIRouter()

@router.get("/alerts")
def get_alerts():
    return alerts_db




@router.post("/alerts")
def create_alert(alert: AlertCreate):

    db: Session = SessionLocal()

    try:

        new_alert = Alert(
            alert_type=alert.alert_type,
            severity=alert.severity,
            source_ip=alert.source_ip,
            destination_ip=alert.destination_ip,
            description=alert.description
        )

        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)

        return {
            "message": "Alert created successfully",
            "alert_id": new_alert.id
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/alerts")
def get_alerts():

    db: Session = SessionLocal()

    try:

        alerts = db.query(Alert).all()

        return alerts

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
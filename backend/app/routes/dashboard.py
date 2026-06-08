from fastapi import APIRouter
from app.storage import alerts_db

router = APIRouter()

@router.get("/dashboard-stats")
def get_dashboard_stats():

    high = 0
    medium = 0
    low = 0

    for alert in alerts_db:

        sev = alert["severity"].lower()

        if sev == "high":
            high += 1

        elif sev == "medium":
            medium += 1

        elif sev == "low":
            low += 1

    return {
        "total_alerts": len(alerts_db),
        "high_severity_alerts": high,
        "medium_severity_alerts": medium,
        "low_severity_alerts": low
    }
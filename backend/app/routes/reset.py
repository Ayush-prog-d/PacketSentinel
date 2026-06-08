from fastapi import APIRouter
from app.storage import alerts_db, traffic_db

router = APIRouter()

@router.post("/reset-data")
def reset_data():

    alerts_db.clear()

    traffic_db["total_packets"] = 0
    traffic_db["protocols"]["HTTP"] = 0
    traffic_db["protocols"]["HTTPS"] = 0
    traffic_db["protocols"]["DNS"] = 0
    traffic_db["suspicious_packets"] = 0

    return {"message": "All dashboard data cleared"}
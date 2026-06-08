from fastapi import APIRouter
from app.storage import traffic_db

router = APIRouter()

@router.get("/traffic-summary")
def get_traffic():
    return traffic_db
from fastapi import FastAPI

from app.routes.upload import router as upload_router
from app.routes.alerts import router as alerts_router
from app.routes.traffic import router as traffic_router
from app.routes.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.reset import router as reset_router

from app.database.database import engine
from app.models.alert_model import Base


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload_router)
app.include_router(alerts_router)
app.include_router(traffic_router)
app.include_router(dashboard_router)
app.include_router(reset_router)

@app.get("/")
def home():
    return {"message": "Sentinel Core Backend Running"}
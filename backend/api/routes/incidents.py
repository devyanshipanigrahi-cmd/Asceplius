from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.sqlite import get_db
from backend.database.models import Incident

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("/")
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.timestamp.desc()).all()

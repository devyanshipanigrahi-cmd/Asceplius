from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.sqlite import get_db
from backend.database.models import Agent

router = APIRouter(prefix="/agents", tags=["agents"])

@router.get("/")
def get_agents(db: Session = Depends(get_db)):
    return db.query(Agent).all()

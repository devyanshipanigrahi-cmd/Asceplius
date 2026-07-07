from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.sqlite import get_db
from database.models import Reflection

router = APIRouter(prefix="/reflections", tags=["reflections"])

@router.get("/")
def get_reflections(db: Session = Depends(get_db)):
    return db.query(Reflection).order_by(Reflection.timestamp.desc()).all()

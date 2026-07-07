from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database.sqlite import Base

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    status = Column(String) # e.g. HEALTHY, DEGRADED, OFFLINE
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    incidents = relationship("Incident", back_populates="agent")

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    error_type = Column(String)
    payload = Column(JSON)
    status = Column(String, default="OPEN") # OPEN, DIAGNOSED, RESOLVED, FAILED
    
    agent = relationship("Agent", back_populates="incidents")
    recoveries = relationship("Recovery", back_populates="incident")

class Recovery(Base):
    __tablename__ = "recoveries"
    
    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"))
    strategy_used = Column(String)
    prompt_version = Column(String)
    success = Column(Boolean, default=False)
    confidence_score = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    incident = relationship("Incident", back_populates="recoveries")
    reflections = relationship("Reflection", back_populates="recovery")

class Reflection(Base):
    __tablename__ = "reflections"
    
    id = Column(String, primary_key=True, index=True)
    recovery_id = Column(String, ForeignKey("recoveries.id"))
    analysis = Column(String)
    suggested_improvements = Column(JSON)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    recovery = relationship("Recovery", back_populates="reflections")

class Strategy(Base):
    __tablename__ = "strategies"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    version = Column(Integer, default=1)
    success_rate = Column(Float, default=0.0)
    total_uses = Column(Integer, default=0)
    content = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(String, primary_key=True, index=True)
    agent_role = Column(String, index=True)
    version = Column(Integer, default=1)
    content = Column(String)
    effectiveness_score = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from pydantic import BaseModel
from typing import Dict, Any, Optional
from knowledge_graph.graph import kg
from database.sqlite import SessionLocal
from database.models import Incident
from datetime import datetime, timezone
import json

class MemoryState(BaseModel):
    agent_id: str
    incident_id: str
    state_payload: Dict[str, Any]

class MemoryManager:
    def __init__(self):
        self.db_session = SessionLocal()

    def process_incoming_memory(self, json_payload: str) -> MemoryState:
        """JSON Memory -> Python Objects"""
        data = json.loads(json_payload)
        state = MemoryState(**data)
        return state

    def store_incident(self, state: MemoryState, error_type: str):
        """Python Objects -> NetworkX & SQLite"""
        
        # SQLite
        db_incident = Incident(
            id=state.incident_id,
            agent_id=state.agent_id,
            error_type=error_type,
            payload=state.state_payload
        )
        self.db_session.add(db_incident)
        self.db_session.commit()
        
        # NetworkX Knowledge Graph
        kg.add_incident(state.incident_id, {
            "agent_id": state.agent_id,
            "error_type": error_type,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        kg.save()

    def close(self):
        self.db_session.close()

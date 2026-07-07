from typing import Dict, Any, Optional
import logging
from backend.database.sqlite import SessionLocal
from backend.database.models import Reflection
from backend.knowledge_graph.graph import kg

class ReflectionEngine:
    def __init__(self):
        self.logger = logging.getLogger("reflection.engine")
        self.db = SessionLocal()
        
    def reflect_on_recovery(self, incident_id: str, recovery_id: str, success: bool, strategy_used: str):
        self.logger.info(f"Reflecting on recovery {recovery_id} for incident {incident_id}")
        
        # Simulate LLM reflection logic
        analysis = "Recovery successful. Strategy validated." if success else "Failed due to incorrect root cause diagnosis or invalid strategy parameters."
        improvements = {"strategy_update": "Increase timeout further"} if not success else {}
        
        reflection = Reflection(
            id=f"ref_{recovery_id}",
            recovery_id=recovery_id,
            analysis=analysis,
            suggested_improvements=improvements
        )
        self.db.add(reflection)
        
        # Update Knowledge Graph if successful
        if success:
            kg.link_incident_to_strategy(incident_id, strategy_used, relationship="RESOLVED_BY", weight=1.5)
            kg.save()
            
        self.db.commit()
        return reflection

    def close(self):
        self.db.close()

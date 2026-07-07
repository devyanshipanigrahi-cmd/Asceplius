import logging
from typing import Dict, Any
from backend.orchestration.workflow import IncidentWorkflow
from backend.database.sqlite import SessionLocal
from backend.database.models import Agent, Recovery
from backend.memory.manager import MemoryManager, MemoryState
import uuid

class SimulationEngine:
    def __init__(self):
        self.logger = logging.getLogger("simulation.engine")
        self.workflow = IncidentWorkflow()
        
    async def trigger_failure(self, agent_name: str, failure_type: str) -> Dict[str, Any]:
        self.logger.info(f"Simulating {failure_type} on {agent_name}")
        
        db = SessionLocal()
        try:
            # 1. Update Agent Status to DEGRADED in relational DB
            agent = db.query(Agent).filter(Agent.id == agent_name).first()
            if agent:
                agent.status = "DEGRADED"
                db.commit()
                
            # 2. Store Incident in relational DB and NetworkX Graph via MemoryManager
            incident_id = f"inc_{uuid.uuid4().hex[:8]}"
            mem_manager = MemoryManager()
            state = MemoryState(
                agent_id=agent_name,
                incident_id=incident_id,
                state_payload={
                    "error": failure_type,
                    "logs": f"Error traceback for {failure_type} at {agent_name}..."
                }
            )
            mem_manager.store_incident(state, error_type=failure_type)
            mem_manager.close()
            
            # 3. Run Workflow Lifecycle
            context = {
                "incident_id": incident_id,
                "agent_id": agent_name,
                "anomaly_detected": True,
                "incident_payload": state.state_payload,
                "error_type": failure_type
            }
            
            result = await self.workflow.run_incident_lifecycle(context)
            
            # 4. Create Recovery record & restore Agent health status
            db_recovery = Recovery(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                incident_id=incident_id,
                strategy_used=result.get("proposed_strategy", {}).get("action", "unknown"),
                prompt_version="v2.5",
                success=True,
                confidence_score=0.92
            )
            db.add(db_recovery)
            
            agent = db.query(Agent).filter(Agent.id == agent_name).first()
            if agent:
                agent.status = "HEALTHY"
                
            db.commit()
            return {**result, "incident_id": incident_id, "recovery_id": db_recovery.id}
        finally:
            db.close()

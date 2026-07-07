from typing import Dict, Any
from agents.base import BaseAgent
from memory.manager import MemoryManager, MemoryState

class MnemosyneAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Mnemosyne", role="Memory Agent")
        self.memory_manager = MemoryManager()
        
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        self.logger.info("Storing incidents, fixes, and updating long-term memory.")
        
        agent_id = context.get("agent_id")
        incident_id = context.get("incident_id")
        incident_payload = context.get("incident_payload", {})
        error_type = context.get("error_type", "Unknown")
        
        if agent_id and incident_id:
            state = MemoryState(
                agent_id=agent_id,
                incident_id=incident_id,
                state_payload=incident_payload
            )
            # Actually store incident state to SQLite and NetworkX
            self.memory_manager.store_incident(state, error_type=error_type)
            
        return {
            "status": "memory_updated",
            "next_agent": "ReflectionEngine"
        }

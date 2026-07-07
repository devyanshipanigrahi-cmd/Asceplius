from typing import Dict, Any
import logging
from agents.asclepius import AsclepiusAgent
from agents.argus import ArgusAgent
from agents.chiron import ChironAgent
from agents.panacea import PanaceaAgent
from agents.hygieia import HygieiaAgent
from agents.phoenix import PhoenixAgent
from agents.mnemosyne import MnemosyneAgent
from reflection.engine import ReflectionEngine

class IncidentWorkflow:
    def __init__(self):
        self.logger = logging.getLogger("orchestration.workflow")
        self.agents = {
            "Asclepius": AsclepiusAgent(),
            "Argus": ArgusAgent(),
            "Chiron": ChironAgent(),
            "Panacea": PanaceaAgent(),
            "Hygieia": HygieiaAgent(),
            "Phoenix": PhoenixAgent(),
            "Mnemosyne": MnemosyneAgent()
        }
        self.reflection_engine = ReflectionEngine()
        
    async def run_incident_lifecycle(self, initial_context: Dict[str, Any]) -> Dict[str, Any]:
        context = initial_context
        current_agent = "Asclepius"
        
        while current_agent and current_agent != "ReflectionEngine":
            self.logger.info(f"Transitioning to {current_agent}")
            agent = self.agents.get(current_agent)
            if not agent:
                self.logger.error(f"Agent {current_agent} not found.")
                break
                
            result = await agent.execute(context)
            context.update(result)
            
            # Workflow state machine routing
            current_agent = result.get("next_agent")
            
        if current_agent == "ReflectionEngine":
            self.logger.info("Executing post-recovery reflection.")
            self.reflection_engine.reflect_on_recovery(
                incident_id=context.get("incident_id", "unknown"),
                recovery_id="rec_mock_001",
                success=True,
                strategy_used=context.get("proposed_strategy", {}).get("action", "unknown")
            )
            
        self.logger.info("Workflow completed.")
        return context

from fastapi import APIRouter
from simulation.engine import SimulationEngine

router = APIRouter(prefix="/simulation", tags=["simulation"])

@router.post("/run")
async def run_simulation(agent_name: str = "hr_agent_01", failure_type: str = "api_timeout"):
    engine = SimulationEngine()
    result = await engine.trigger_failure(agent_name, failure_type)
    return {"status": "completed", "result": result}

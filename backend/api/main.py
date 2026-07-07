from fastapi import FastAPI
from core.config import settings
from core.logging import setup_logging
from api.routes import health, simulation, agents, incidents, metrics, reflections, knowledge
from database.sqlite import engine, Base, SessionLocal
from database.models import Agent

# Initialize logging
setup_logging()

# Create SQLite tables
Base.metadata.create_all(bind=engine)

# Seed initial agents if empty
db = SessionLocal()
try:
    if db.query(Agent).count() == 0:
        initial_agents = [
            Agent(id="customer_support", name="Customer Support Agent", description="User Query Handling", status="HEALTHY"),
            Agent(id="coding_agent", name="Coding Agent", description="Code Repair & Generation", status="HEALTHY"),
            Agent(id="finance_agent", name="Finance Agent", description="Audit & Ledger Verification", status="HEALTHY"),
            Agent(id="hr_agent", name="HR Agent", description="Policy Q&A & Onboarding", status="HEALTHY"),
            Agent(id="procurement", name="Procurement Agent", description="Vendor Contract Ingestion", status="HEALTHY"),
            Agent(id="knowledge_agent", name="Knowledge Agent", description="Vector DB & Indexing", status="HEALTHY"),
        ]
        db.bulk_save_objects(initial_agents)
        db.commit()
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="The Autonomous Healing System for Enterprise AI Agents"
)

app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(agents.router, prefix=settings.API_V1_STR)
app.include_router(incidents.router, prefix=settings.API_V1_STR)
app.include_router(metrics.router, prefix=settings.API_V1_STR)
app.include_router(reflections.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)

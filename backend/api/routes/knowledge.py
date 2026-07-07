from fastapi import APIRouter
from knowledge_graph.graph import kg
import networkx as nx

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

@router.get("/")
def get_knowledge_graph():
    return nx.node_link_data(kg.graph)

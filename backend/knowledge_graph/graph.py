import networkx as nx
import json
import os
from typing import Dict, Any, List

class KnowledgeGraph:
    def __init__(self, storage_path: str = "knowledge_graph.json"):
        self.graph = nx.DiGraph()
        self.storage_path = storage_path
        self.load()

    def add_incident(self, incident_id: str, attributes: Dict[str, Any]):
        self.graph.add_node(incident_id, type="Incident", **attributes)

    def add_strategy(self, strategy_id: str, attributes: Dict[str, Any]):
        self.graph.add_node(strategy_id, type="Strategy", **attributes)

    def link_incident_to_strategy(self, incident_id: str, strategy_id: str, relationship: str = "RESOLVED_BY", weight: float = 1.0):
        self.graph.add_edge(incident_id, strategy_id, type=relationship, weight=weight)
        
    def find_similar_incidents(self, error_type: str) -> List[str]:
        similar = []
        for node, data in self.graph.nodes(data=True):
            if data.get("type") == "Incident" and data.get("error_type") == error_type:
                similar.append(node)
        return similar
        
    def get_best_strategy(self, incident_id: str) -> str | None:
        if incident_id not in self.graph:
            return None
            
        strategies = []
        for neighbor in self.graph.successors(incident_id):
            edge_data = self.graph.get_edge_data(incident_id, neighbor)
            node_data = self.graph.nodes[neighbor]
            if node_data.get("type") == "Strategy" and edge_data.get("type") == "RESOLVED_BY":
                strategies.append((neighbor, edge_data.get("weight", 0.0)))
                
        if not strategies:
            return None
            
        strategies.sort(key=lambda x: x[1], reverse=True)
        return strategies[0][0]

    def save(self):
        data = nx.node_link_data(self.graph)
        with open(self.storage_path, 'w') as f:
            json.dump(data, f, indent=2)

    def load(self):
        if os.path.exists(self.storage_path):
            with open(self.storage_path, 'r') as f:
                data = json.load(f)
                self.graph = nx.node_link_graph(data)

kg = KnowledgeGraph()

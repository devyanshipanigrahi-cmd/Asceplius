from typing import Any, Dict, List, Callable
import logging

class BaseAgent:
    """
    Abstract base class for ASCLEPIUS agents using Google ADK concepts.
    Provides common telemetry, state management, and tool binding.
    """
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.logger = logging.getLogger(f"agent.{self.name}")
        self.tools: List[Callable] = []

    def bind_tool(self, tool_func: Callable):
        """Binds a tool/function to the agent's capability list."""
        self.tools.append(tool_func)
        self.logger.info(f"Tool {tool_func.__name__} bound to {self.name}")

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Main execution loop. Must be overridden by specific agents."""
        raise NotImplementedError("Each agent must implement its own execute logic.")

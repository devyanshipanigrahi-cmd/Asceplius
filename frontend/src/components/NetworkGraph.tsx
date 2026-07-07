import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, MarkerType } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useApp } from "../context/AppContext";

export const NetworkGraph: React.FC = () => {
  const { agents, setSelectedAgent, activeGraphType, setActiveGraphType, activeIncident } = useApp();

  // Create customized nodes based on agent states and active graph mode
  const nodes: Node[] = useMemo(() => {
    if (activeGraphType === "network" || activeGraphType === "propagation") {
      const centerNode: Node = {
        id: "asclepius",
        type: "default",
        data: { label: "ASCLEPIUS CORE" },
        position: { x: 300, y: 200 },
        style: {
          background: "#1c1c1f",
          color: "#06b6d4",
          border: "2px solid #06b6d4",
          fontWeight: "bold",
          fontSize: "11px",
          width: 140,
          textAlign: "center",
          boxShadow: "0 0 15px rgba(6,182,212,0.25)"
        }
      };

      const circleNodes: Node[] = agents.map((agent, index) => {
        const angle = (index * 2 * Math.PI) / agents.length;
        const radius = 180;
        const x = 300 + radius * Math.cos(angle) + 20; // offset to fit ASCLEPIUS center width
        const y = 200 + radius * Math.sin(angle);

        let border = "1px solid #2d2d30";
        let bg = "#1c1c1f";
        let shadow = "none";

        if (agent.status === "DEGRADED" || agent.status === "OFFLINE") {
          border = "1px solid #ef4444";
          bg = "rgba(239, 68, 68, 0.05)";
          shadow = "0 0 10px rgba(239, 68, 68, 0.25)";
        } else if (agent.status === "LEARNING") {
          border = "1px solid #06b6d4";
          bg = "rgba(6, 182, 212, 0.05)";
          shadow = "0 0 10px rgba(6, 182, 212, 0.25)";
        } else if (agent.status === "HEALTHY") {
          border = "1px solid #10b981";
        }

        return {
          id: agent.id,
          type: "default",
          data: { label: agent.name.toUpperCase() },
          position: { x, y },
          style: {
            background: bg,
            color: "#e4e4e7",
            border,
            fontSize: "10px",
            width: 120,
            textAlign: "center",
            boxShadow: shadow
          }
        };
      });

      return [centerNode, ...circleNodes];
    }

    if (activeGraphType === "knowledge") {
      return [
        { id: "inc_root", data: { label: "API TIMEOUT EXCEPTION" }, position: { x: 150, y: 150 }, style: { border: "1px solid #ef4444", color: "#ef4444", fontSize: "9px" } },
        { id: "strategy_root", data: { label: "STRATEGY: ADAPTIVE TIMEOUT" }, position: { x: 350, y: 150 }, style: { border: "1px solid #06b6d4", color: "#06b6d4", fontSize: "9px" } },
        { id: "fix_root", data: { label: "PATCH: CLIENT SETTING UPDATE" }, position: { x: 350, y: 250 }, style: { border: "1px solid #10b981", color: "#10b981", fontSize: "9px" } }
      ];
    }

    if (activeGraphType === "strategy") {
      return [
        { id: "v1", data: { label: "STRATEGY V1: RESTART NODE" }, position: { x: 100, y: 200 }, style: { border: "1px solid #52525b", color: "#a1a1aa", fontSize: "9px" } },
        { id: "v2", data: { label: "STRATEGY V2: CACHE INGEST" }, position: { x: 300, y: 200 }, style: { border: "1px solid #52525b", color: "#a1a1aa", fontSize: "9px" } },
        { id: "v3", data: { label: "STRATEGY V3: BACKOFF RETRY (ACTIVE)" }, position: { x: 500, y: 200 }, style: { border: "1px solid #10b981", color: "#10b981", fontSize: "9px" } }
      ];
    }

    // Default placeholder nodes for dependency
    return [
      { id: "dep_c", data: { label: "FINANCE AGENT" }, position: { x: 150, y: 200 }, style: { border: "1px solid #ef4444", color: "#ef4444", fontSize: "9px" } },
      { id: "dep_d", data: { label: "STRIPE MCP DB (OUTAGE)" }, position: { x: 350, y: 200 }, style: { border: "1px solid #ef4444", color: "#ef4444", fontSize: "9px" } }
    ];
  }, [agents, activeGraphType]);

  const edges: Edge[] = useMemo(() => {
    if (activeGraphType === "network" || activeGraphType === "propagation") {
      return agents.map((agent) => {
        const isPropagation = activeGraphType === "propagation" && agent.status === "LEARNING";
        return {
          id: `e-asclepius-${agent.id}`,
          source: "asclepius",
          target: agent.id,
          animated: isPropagation || agent.status !== "HEALTHY",
          style: {
            stroke: isPropagation ? "#06b6d4" : agent.status === "DEGRADED" ? "#ef4444" : "#2d2d30",
            strokeWidth: isPropagation || agent.status !== "HEALTHY" ? 2 : 1
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isPropagation ? "#06b6d4" : agent.status === "DEGRADED" ? "#ef4444" : "#2d2d30"
          }
        };
      });
    }

    if (activeGraphType === "knowledge") {
      return [
        { id: "e-1", source: "inc_root", target: "strategy_root", label: "RESOLVED BY", animated: true, style: { stroke: "#06b6d4" } },
        { id: "e-2", source: "strategy_root", target: "fix_root", label: "PROMOTES", style: { stroke: "#10b981" } }
      ];
    }

    if (activeGraphType === "strategy") {
      return [
        { id: "e-v1-v2", source: "v1", target: "v2", label: "EVOLVED", style: { stroke: "#2d2d30" } },
        { id: "e-v2-v3", source: "v2", target: "v3", label: "STABILIZED", animated: true, style: { stroke: "#10b981" } }
      ];
    }

    return [
      { id: "e-dep", source: "dep_c", target: "dep_d", label: "BLOCKING DEPENDENCY", animated: true, style: { stroke: "#ef4444" } }
    ];
  }, [agents, activeGraphType]);

  const graphTypes: { id: typeof activeGraphType; label: string }[] = [
    { id: "network", label: "AGENT IMMUNE NETWORK" },
    { id: "knowledge", label: "KNOWLEDGE GRAPH (NX)" },
    { id: "dependency", label: "CASCADING FAILURE PATHS" },
    { id: "strategy", label: "STRATEGY EVOLUTION TREE" },
    { id: "propagation", label: "KNOWLEDGE PROPAGATION" },
  ];

  return (
    <div className="flex-1 bg-graphite relative flex flex-col overflow-hidden select-none">
      {/* Top panel switcher */}
      <div className="h-10 border-b border-charcoal bg-[#1c1c1f] flex items-center px-4 justify-between z-10">
        <div className="flex gap-2">
          {graphTypes.map((gt) => (
            <button
              key={gt.id}
              onClick={() => setActiveGraphType(gt.id)}
              className={`text-[9px] font-mono px-2.5 py-1 border transition-colors ${
                activeGraphType === gt.id
                  ? "bg-cyanHighlight/10 border-cyanHighlight/40 text-cyanHighlight"
                  : "bg-graphite/40 border-zinc-800 text-zinc-500 hover:text-zinc-400"
              }`}
            >
              {gt.label}
            </button>
          ))}
        </div>

        {activeIncident && activeGraphType === "propagation" && (
          <div className="text-[10px] text-cyanHighlight font-mono animate-pulse uppercase">
            Animating immune learning propagation...
          </div>
        )}
      </div>

      {/* Main Flow component */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => {
            const agent = agents.find(a => a.id === node.id);
            if (agent) setSelectedAgent(agent);
          }}
          fitView
        >
          <Background color="#27272a" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Terminal, X, Play } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { agents, runSimulation } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<string>("customer_support");
  const [selectedFailure, setSelectedFailure] = useState<string>("api_timeout");

  if (!isOpen) return null;

  const handleExecute = async () => {
    onClose();
    await runSimulation(selectedAgent, selectedFailure);
  };

  const failures = [
    { value: "api_timeout", label: "API Timeout (Network Degradation)", severity: "AMBER" },
    { value: "hallucination", label: "LLM Hallucination (Prompt Drift)", severity: "RED" },
    { value: "mcp_failure", label: "MCP Server Disconnection (Tool Outage)", severity: "RED" },
    { value: "dependency_conflict", label: "Dependency Conflict (Package Drift)", severity: "AMBER" },
    { value: "security_violation", label: "Security Guardrail Violation (Injection)", severity: "RED" },
  ];

  return (
    <div className="fixed inset-0 bg-graphite/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1f] border border-zinc-800 w-full max-w-lg rounded shadow-2xl overflow-hidden flex flex-col font-mono">
        {/* Header */}
        <div className="p-3 bg-charcoal border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyanHighlight" />
            <span className="text-xs font-bold text-zinc-300">ASCLEPIUS INCIDENT CONTROL INJECTOR</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Target Agent Node</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full bg-graphite border border-zinc-800 text-zinc-200 p-2 text-xs rounded focus:outline-none focus:border-cyanHighlight"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Simulation Vector</label>
            <div className="space-y-1">
              {failures.map((fail) => (
                <button
                  key={fail.value}
                  onClick={() => setSelectedFailure(fail.value)}
                  className={`w-full text-left p-2 text-xs rounded border flex justify-between items-center transition-colors ${
                    selectedFailure === fail.value
                      ? "bg-cyanHighlight/10 border-cyanHighlight/40 text-cyanHighlight"
                      : "bg-graphite/40 border-zinc-800/60 text-zinc-400 hover:bg-graphite/80"
                  }`}
                >
                  <span>{fail.label}</span>
                  <span className={`text-[9px] px-1 rounded ${
                    fail.severity === "RED" ? "bg-redCritical/20 text-redCritical" : "bg-amberWarning/20 text-amberWarning"
                  }`}>
                    {fail.severity}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-charcoal border-t border-zinc-800 flex justify-between items-center">
          <span className="text-[10px] text-zinc-500">EXECUTE IMMUNE SIMULATION WORKFLOW</span>
          <button
            onClick={handleExecute}
            className="bg-cyanHighlight/20 hover:bg-cyanHighlight/30 text-cyanHighlight border border-cyanHighlight/40 text-xs px-4 py-1.5 rounded flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            INJECT FAILURE
          </button>
        </div>
      </div>
    </div>
  );
};

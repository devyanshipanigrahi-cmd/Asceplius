import React from "react";
import { X, CheckCircle, AlertTriangle, Cpu } from "lucide-react";
import type { AgentData } from "../context/AppContext";

interface AgentDetailsProps {
  agent: AgentData | null;
  onClose: () => void;
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="absolute right-0 top-10 bottom-0 w-80 bg-charcoal border-l border-zinc-800 z-20 flex flex-col font-mono text-xs text-zinc-300 select-none shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-graphite/60">
        <div>
          <h3 className="font-bold text-zinc-100 uppercase text-xs">{agent.name}</h3>
          <span className="text-[9px] text-zinc-500 block mt-0.5">ROLE: {agent.role}</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status indicator */}
        <div className="flex items-center justify-between border border-[#2d2d30] p-2.5 rounded bg-graphite/40">
          <span className="text-[10px] text-zinc-500">OPERATIONAL STATE</span>
          <div className="flex items-center gap-1.5 font-bold">
            {agent.status === "HEALTHY" ? (
              <>
                <CheckCircle className="w-4 h-4 text-emeraldHealthy" />
                <span className="text-emeraldHealthy text-[10px]">HEALTHY</span>
              </>
            ) : agent.status === "LEARNING" ? (
              <>
                <Cpu className="w-4 h-4 text-cyanHighlight animate-pulse" />
                <span className="text-cyanHighlight text-[10px]">LEARNING</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-redCritical animate-bounce" />
                <span className="text-redCritical text-[10px]">DEGRADED</span>
              </>
            )}
          </div>
        </div>

        {/* Technical metrics */}
        <div className="space-y-2">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">SYSTEM STATS</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-graphite/20 border border-zinc-800/80 p-2 rounded">
              <span className="text-[9px] text-zinc-500 block">MEMORY SCORE</span>
              <span className="text-sm font-bold text-zinc-200">{agent.memoryScore}/100</span>
            </div>
            <div className="bg-graphite/20 border border-zinc-800/80 p-2 rounded">
              <span className="text-[9px] text-zinc-500 block">PROMPT VERSION</span>
              <span className="text-sm font-bold text-zinc-200">{agent.currentPromptVersion}</span>
            </div>
          </div>
        </div>

        {/* Current heal strategy */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">ACTIVE HEAL STRATEGY</span>
          <div className="bg-graphite/20 border border-zinc-800/80 p-2.5 rounded text-[11px] text-zinc-300">
            {agent.currentStrategy}
          </div>
        </div>

        {/* Tools in use */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">BOUND MCP TOOLS</span>
          <div className="space-y-1">
            {agent.toolUsage.map((tool, idx) => (
              <div key={idx} className="flex justify-between items-center bg-graphite/20 border border-zinc-800/60 p-2 rounded text-[11px]">
                <span className="text-zinc-400 font-bold text-[10px]">{tool.name}</span>
                <span className="text-zinc-600 font-bold">{tool.count} calls</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerabilities & weaknesses */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">MONITORED WEAKNESSES</span>
          <div className="space-y-1">
            {agent.knownWeaknesses.map((weakness, idx) => (
              <div key={idx} className="bg-redCritical/5 border border-redCritical/15 text-redCritical/80 px-2 py-1.5 rounded text-[10px] uppercase">
                {weakness}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

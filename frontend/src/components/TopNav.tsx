import React from "react";
import { Shield, Activity } from "lucide-react";
import { useApp } from "../context/AppContext";

export const TopNav: React.FC<{ onOpenPalette: () => void }> = ({ onOpenPalette }) => {
  const { systemTime, agents, activeIncident } = useApp();
  
  const healthyCount = agents.filter(a => a.status === "HEALTHY").length;
  const isEcosystemHealthy = healthyCount === agents.length;

  return (
    <nav className="h-14 border-b border-charcoal bg-graphite flex items-center justify-between px-6 select-none">
      {/* Title / Identity */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-cyanHighlight animate-pulse" />
        <div>
          <h1 className="text-lg font-bold tracking-wider text-zinc-100 uppercase">ASCLEPIUS</h1>
          <span className="text-[10px] text-zinc-500 font-mono">AUTONOMOUS HEALING SYSTEM // V1.0.0</span>
        </div>
      </div>

      {/* Center status bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-[#1c1c1f] px-3 py-1 rounded border border-[#2d2d30]">
          <Activity className={`w-4 h-4 ${isEcosystemHealthy ? "text-emeraldHealthy" : "text-amberWarning animate-bounce"}`} />
          <span className="text-xs text-zinc-400 font-mono">
            ECOSYSTEM HEALTH: <span className={isEcosystemHealthy ? "text-emeraldHealthy font-bold" : "text-amberWarning font-bold"}>
              {isEcosystemHealthy ? "SECURED" : "HEALING ACTIVE"}
            </span>
          </span>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          HEALTHY AGENTS: <span className="text-zinc-300 font-bold">{healthyCount}/{agents.length}</span>
        </div>
      </div>

      {/* Right controls / status */}
      <div className="flex items-center gap-4">
        {activeIncident && (
          <div className="flex items-center gap-2 bg-redCritical/10 border border-redCritical/20 px-3 py-1 rounded text-redCritical text-xs font-mono animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-redCritical animate-ping"></span>
            ACTIVE INCIDENT: {activeIncident.errorType}
          </div>
        )}

        <button 
          onClick={onOpenPalette}
          className="text-xs font-mono text-cyanHighlight bg-cyanHighlight/10 hover:bg-cyanHighlight/20 border border-cyanHighlight/30 px-3 py-1 rounded transition-colors"
        >
          [ CMD PALETTE ]
        </button>

        <div className="text-xs text-zinc-400 font-mono border-l border-charcoal pl-4">
          SYS_TIME: <span className="text-zinc-200">{systemTime || "00:00:00"}</span>
        </div>
      </div>
    </nav>
  );
};

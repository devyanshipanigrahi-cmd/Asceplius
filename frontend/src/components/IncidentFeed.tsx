import React from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export const IncidentFeed: React.FC = () => {
  const { incidents, activeIncident, runReplay } = useApp();

  return (
    <div className="w-80 border-r border-charcoal bg-graphite flex flex-col h-full overflow-hidden select-none">
      <div className="p-4 border-b border-charcoal flex justify-between items-center bg-[#1c1c1f]">
        <h2 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">Live Incident Feed</h2>
        <span className="text-[10px] bg-redCritical/15 text-redCritical px-1.5 py-0.5 rounded font-mono">
          {incidents.length} EVENTS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Incident Detail Tracking */}
        {activeIncident && (
          <div className="border border-redCritical/30 bg-redCritical/5 rounded p-3 space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-redCritical mt-0.5 animate-pulse" />
              <div>
                <div className="text-xs font-mono font-bold text-zinc-200">
                  {activeIncident.agentId.toUpperCase()} FAILURE
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  ID: {activeIncident.id} | {activeIncident.timestamp}
                </div>
              </div>
            </div>

            <div className="border-t border-charcoal pt-2 space-y-1.5">
              {activeIncident.timeline.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    {item.status === "completed" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emeraldHealthy"></span>
                    ) : item.status === "active" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amberWarning animate-ping"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                    )}
                    <span className={item.status === "completed" ? "text-zinc-400" : item.status === "active" ? "text-amberWarning font-bold" : "text-zinc-600"}>
                      {item.step}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incident History List */}
        <div className="space-y-2">
          {incidents.filter(inc => inc.id !== activeIncident?.id).map((inc) => (
            <div 
              key={inc.id}
              className="border border-[#2d2d30] hover:border-zinc-700 bg-charcoal/30 rounded p-2.5 space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  {inc.agentId}
                </span>
                <span className="text-[9px] font-mono text-zinc-500">
                  {inc.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-zinc-300 font-semibold">{inc.errorType}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runReplay(inc.id)}
                    className="text-[9px] text-cyanHighlight bg-cyanHighlight/10 hover:bg-cyanHighlight/20 border border-cyanHighlight/30 px-1.5 py-0.5 rounded font-mono transition-colors"
                  >
                    REPLAY
                  </button>
                  <div className="flex items-center gap-1 text-[10px] text-emeraldHealthy">
                    <CheckCircle className="w-3 h-3" />
                    <span>HEALED</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {incidents.length === 0 && !activeIncident && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-2">
              <Clock className="w-8 h-8 opacity-40" />
              <p className="text-[11px] font-mono uppercase tracking-wider">No active incidents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

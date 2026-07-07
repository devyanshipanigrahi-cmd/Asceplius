import React, { useState } from "react";
import { Activity, ShieldCheck, Zap, Server, Database, Eye } from "lucide-react";
import { useApp } from "../context/AppContext";
import { SecurityPanel } from "./SecurityPanel";
import { ReflectionPanel } from "./ReflectionPanel";

export const ImmuneResponsePipeline: React.FC = () => {
  const { activeWorkflowStep, activeIncident } = useApp();
  const [activeTab, setActiveTab] = useState<"pipeline" | "security" | "reflection">("pipeline");

  const pipelineStages = [
    { key: "Argus", name: "ARGUS Monitoring", desc: "Drift & Anomaly Detection", icon: Eye },
    { key: "Chiron", name: "CHIRON Diagnosis", desc: "Correlating & Root Cause Analysis", icon: Activity },
    { key: "Panacea", name: "PANACEA Recovery", desc: "Fix & Strategy Generation", icon: Zap },
    { key: "Hygieia", name: "HYGIEIA Security", desc: "Payload Verification & Scan", icon: ShieldCheck },
    { key: "Phoenix", name: "PHOENIX Deployment", desc: "Sandbox Promotion", icon: Server },
    { key: "Mnemosyne", name: "MNEMOSYNE Memory", desc: "Knowledge Graph Integration", icon: Database },
  ];

  return (
    <div className="w-80 border-l border-charcoal bg-graphite flex flex-col h-full overflow-hidden select-none">
      {/* Tab Switcher Header */}
      <div className="flex border-b border-charcoal bg-[#1c1c1f]">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex-1 py-3 text-[10px] font-mono font-bold tracking-wider text-center border-r border-charcoal transition-colors ${
            activeTab === "pipeline" 
              ? "text-cyanHighlight bg-graphite/40 border-b-2 border-b-cyanHighlight" 
              : "text-zinc-500 hover:text-zinc-400"
          }`}
        >
          [ PIPELINE ]
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex-1 py-3 text-[10px] font-mono font-bold tracking-wider text-center border-r border-charcoal transition-colors ${
            activeTab === "security" 
              ? "text-cyanHighlight bg-graphite/40 border-b-2 border-b-cyanHighlight" 
              : "text-zinc-500 hover:text-zinc-400"
          }`}
        >
          [ SECURITY ]
        </button>
        <button
          onClick={() => setActiveTab("reflection")}
          className={`flex-1 py-3 text-[10px] font-mono font-bold tracking-wider text-center transition-colors ${
            activeTab === "reflection" 
              ? "text-cyanHighlight bg-graphite/40 border-b-2 border-b-cyanHighlight" 
              : "text-zinc-500 hover:text-zinc-400"
          }`}
        >
          [ REFLECTION ]
        </button>
      </div>

      {/* Main Tab Panels Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            <div className="relative border-l border-[#2d2d30] ml-3 pl-6 space-y-6">
              {pipelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = activeWorkflowStep === stage.key;
                const isCompleted = activeIncident && activeIncident.timeline.some(
                  t => t.step.startsWith(stage.key) && t.status === "completed"
                );

                return (
                  <div key={idx} className="relative group">
                    {/* Pipeline line bullet */}
                    <span className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border transition-all duration-300 ${
                      isActive 
                        ? "bg-amberWarning border-amberWarning scale-125 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : isCompleted 
                          ? "bg-emeraldHealthy border-emeraldHealthy" 
                          : "bg-graphite border-[#2d2d30]"
                    }`} />

                    <div className={`p-2.5 rounded border transition-colors duration-300 ${
                      isActive 
                        ? "bg-amberWarning/5 border-amberWarning/30" 
                        : isCompleted
                          ? "bg-emeraldHealthy/5 border-emeraldHealthy/20"
                          : "bg-charcoal/20 border-[#2d2d30]"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${
                          isActive 
                            ? "text-amberWarning animate-pulse" 
                            : isCompleted 
                              ? "text-emeraldHealthy" 
                              : "text-zinc-500"
                        }`} />
                        <span className={`text-xs font-mono font-bold ${
                          isActive ? "text-amberWarning" : isCompleted ? "text-zinc-200" : "text-zinc-500"
                        }`}>
                          {stage.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {!activeIncident && (
              <div className="text-center py-8 border border-dashed border-[#2d2d30] rounded p-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">PIPELINE STANDBY</span>
                <span className="text-[9px] font-mono text-zinc-600 block mt-1">Ready for simulation events</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && <SecurityPanel />}

        {activeTab === "reflection" && <ReflectionPanel />}
      </div>
    </div>
  );
};

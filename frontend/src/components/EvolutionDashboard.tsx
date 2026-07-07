import React from "react";
import { Brain, Cpu, Hourglass, Database, Activity } from "lucide-react";
import { useApp } from "../context/AppContext";

export const EvolutionDashboard: React.FC = () => {
  const { metrics } = useApp();

  const cards = [
    { name: "KNOWLEDGE GRAPH NODES", value: `${metrics.knowledgeGrowth} Nodes`, desc: "+2 nodes per recovery", icon: Brain, color: "text-cyanHighlight" },
    { name: "RECOVERY SUCCESS RATE", value: `${metrics.recoverySuccessRate}%`, desc: "Target rate: >95.0%", icon: Activity, color: "text-emeraldHealthy" },
    { name: "AVG HEAL DURATION", value: `${metrics.avgRecoveryTimeSec}s`, desc: "Autonomously optimized", icon: Hourglass, color: "text-amberWarning" },
    { name: "MNEMOSYNE DB SIZE", value: `${(metrics.memorySizeKb / 1024).toFixed(2)} MB`, desc: "Local SQLite + JSON storage", icon: Database, color: "text-zinc-400" },
    { name: "TOTAL REFLECTIONS", value: metrics.reflectionCount.toString(), desc: "Post-healing feedback runs", icon: Cpu, color: "text-cyanHighlight" },
  ];

  return (
    <div className="h-28 border-t border-charcoal bg-graphite flex items-center justify-between px-6 select-none">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="flex-1 border-r border-[#2d2d30] last:border-0 px-4 py-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase">
                {card.name}
              </span>
            </div>
            <div>
              <span className="text-sm font-mono font-bold text-zinc-200 tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="text-[9px] font-mono text-zinc-600 uppercase">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};

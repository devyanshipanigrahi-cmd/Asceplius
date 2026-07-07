import React from "react";
import { BrainCircuit, BookOpen, Lightbulb, CheckSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

export const ReflectionPanel: React.FC = () => {
  const { activeReflection } = useApp();

  if (!activeReflection) {
    return (
      <div className="text-center py-12 border border-dashed border-[#2d2d30] rounded p-4 font-mono text-[10px] text-zinc-500">
        <span>AWAITING REFLECTION METRICS</span>
        <p className="mt-1 text-[9px] text-zinc-600">Trigger a simulated healing cycle to generate post-event logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-xs text-zinc-300">
      {/* Root Cause & Strategy */}
      <div className="border border-zinc-800 bg-graphite/40 p-3 rounded space-y-2">
        <div className="flex items-center gap-1.5 text-cyanHighlight">
          <BrainCircuit className="w-4 h-4" />
          <span className="font-bold text-[10px] uppercase">COGNITIVE RESOLUTION</span>
        </div>
        
        <div className="space-y-1">
          <span className="text-[9px] text-zinc-500 block">ROOT CAUSE:</span>
          <p className="text-zinc-200 font-bold">{activeReflection.rootCause}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[9px] text-zinc-500 block">CHOSEN STRATEGY:</span>
          <p className="text-zinc-200 font-bold">{activeReflection.chosenStrategy}</p>
        </div>
      </div>

      {/* Rationale and Lessons */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-zinc-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase">DECISION RATIONALE</span>
          </div>
          <p className="text-[11px] text-zinc-400 bg-charcoal/20 border border-zinc-800/60 p-2 rounded">
            {activeReflection.reason}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-zinc-400">
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase">LESSONS LEARNED</span>
          </div>
          <p className="text-[11px] text-zinc-400 bg-charcoal/20 border border-zinc-800/60 p-2 rounded">
            {activeReflection.lessonsLearned}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-zinc-400">
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase">RECOMMENDATION</span>
          </div>
          <p className="text-[11px] text-zinc-400 bg-charcoal/20 border border-zinc-800/60 p-2 rounded">
            {activeReflection.recommendations}
          </p>
        </div>
      </div>
    </div>
  );
};

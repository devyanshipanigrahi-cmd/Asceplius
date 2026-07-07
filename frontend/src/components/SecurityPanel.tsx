import React from "react";
import { Key, Terminal, Code } from "lucide-react";
import { useApp } from "../context/AppContext";

export const SecurityPanel: React.FC = () => {
  const { securityData } = useApp();

  return (
    <div className="space-y-4 font-mono text-xs text-zinc-300">
      {/* Risk Score */}
      <div className="border border-zinc-800 bg-graphite/40 p-3 rounded space-y-1.5">
        <div className="flex justify-between items-center text-[10px] text-zinc-500">
          <span>RISK ASSESS SCORE</span>
          <span className="text-zinc-400 font-bold">CVSS V3</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emeraldHealthy">{securityData.riskScore}/100</span>
          <span className="text-[10px] text-emeraldHealthy bg-emeraldHealthy/10 px-1 rounded">SECURE</span>
        </div>
      </div>

      {/* Security Vector Scans */}
      <div className="space-y-2">
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">IMMUNE VECTOR STATUS</span>
        
        <div className="bg-graphite/20 border border-zinc-800 p-2.5 rounded flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyanHighlight" />
            <span>Prompt Injection Guard</span>
          </div>
          <span className="text-emeraldHealthy font-bold text-[10px]">PASS ({securityData.promptInjectionScore})</span>
        </div>

        <div className="bg-graphite/20 border border-zinc-800 p-2.5 rounded flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-cyanHighlight" />
            <span>Secret Scanner</span>
          </div>
          <span className="text-emeraldHealthy font-bold text-[10px]">{securityData.secretScanStatus}</span>
        </div>

        <div className="bg-graphite/20 border border-zinc-800 p-2.5 rounded flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-cyanHighlight" />
            <span>Dependency Scan</span>
          </div>
          <span className="text-emeraldHealthy font-bold text-[10px]">0 CVEs</span>
        </div>
      </div>

      {/* Sandbox and Approvals */}
      <div className="space-y-2 border-t border-zinc-800 pt-3">
        <div className="flex justify-between text-[11px]">
          <span className="text-zinc-500">SANDBOX STATUS:</span>
          <span className="text-cyanHighlight font-bold">{securityData.sandboxStatus}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-zinc-500">APPROVAL FLOW:</span>
          <span className="text-emeraldHealthy font-bold">{securityData.approvalStatus}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-zinc-500">ROLLBACK READY:</span>
          <span className="text-zinc-400 font-bold">YES (IMMUTABLE)</span>
        </div>
      </div>
    </div>
  );
};

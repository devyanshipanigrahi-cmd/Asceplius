import React, { createContext, useContext, useState, useEffect } from "react";

export interface AgentData {
  id: string;
  name: string;
  role: string;
  status: "HEALTHY" | "DEGRADED" | "OFFLINE" | "LEARNING";
  memoryScore: number;
  currentStrategy: string;
  currentPromptVersion: string;
  knownWeaknesses: string[];
  toolUsage: { name: string; count: number }[];
}

export interface IncidentStep {
  id: string;
  agentId: string;
  errorType: string;
  status: "OPEN" | "DIAGNOSED" | "RESOLVED" | "FAILED";
  timestamp: string;
  timeline: { step: string; status: "completed" | "active" | "pending"; time: string }[];
}

export interface SystemMetrics {
  knowledgeGrowth: number;
  recoverySuccessRate: number;
  avgRecoveryTimeSec: number;
  strategyVersions: number;
  memorySizeKb: number;
  reflectionCount: number;
}

export interface SecurityEventData {
  promptInjectionScore: number;
  secretScanStatus: "CLEAN" | "FLAGGED";
  cvesFound: number;
  riskScore: number;
  sandboxStatus: "ACTIVE" | "INACTIVE";
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
}

export interface ReflectionData {
  rootCause: string;
  chosenStrategy: string;
  confidence: number;
  reason: string;
  lessonsLearned: string;
  recommendations: string;
}

interface AppContextType {
  agents: AgentData[];
  incidents: IncidentStep[];
  activeIncident: IncidentStep | null;
  activeWorkflowStep: string | null;
  metrics: SystemMetrics;
  selectedAgent: AgentData | null;
  setSelectedAgent: (agent: AgentData | null) => void;
  activeGraphType: "network" | "knowledge" | "propagation" | "strategy" | "dependency";
  setActiveGraphType: (type: "network" | "knowledge" | "propagation" | "strategy" | "dependency") => void;
  runSimulation: (agentId: string, failureType: string) => Promise<void>;
  clearActiveIncident: () => void;
  systemTime: string;
  securityData: SecurityEventData;
  activeReflection: ReflectionData | null;
  runReplay: (incidentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAgents: AgentData[] = [
  { id: "customer_support", name: "Customer Support Agent", role: "User Query Handling", status: "HEALTHY", memoryScore: 92, currentStrategy: "Strict RAG Verification", currentPromptVersion: "v2.4", knownWeaknesses: ["Tone drift", "Out of domain queries"], toolUsage: [{ name: "Support DB Search", count: 142 }, { name: "Refund API", count: 28 }] },
  { id: "coding_agent", name: "Coding Agent", role: "Code Repair & Generation", status: "HEALTHY", memoryScore: 88, currentStrategy: "Syntax Validator Pipeline", currentPromptVersion: "v3.1", knownWeaknesses: ["Infinite loops", "Deprecated API use"], toolUsage: [{ name: "Sandbox Compiler", count: 320 }, { name: "Git Committer", count: 180 }] },
  { id: "finance_agent", name: "Finance Agent", role: "Audit & Ledger Verification", status: "HEALTHY", memoryScore: 95, currentStrategy: "Double Entry Cross-Check", currentPromptVersion: "v1.9", knownWeaknesses: ["Currency rounding", "API timeouts"], toolUsage: [{ name: "Stripe Ingest", count: 95 }, { name: "Ledger DB Write", count: 110 }] },
  { id: "hr_agent", name: "HR Agent", role: "Policy Q&A & Onboarding", status: "HEALTHY", memoryScore: 84, currentStrategy: "Semantic Search Filter", currentPromptVersion: "v2.0", knownWeaknesses: ["Personal info leaks", "Outdated Handbook"], toolUsage: [{ name: "Employee Directory", count: 64 }, { name: "Knowledge Search", count: 130 }] },
  { id: "procurement", name: "Procurement Agent", role: "Vendor Contract Ingestion", status: "HEALTHY", memoryScore: 89, currentStrategy: "Schema Matcher Guardrails", currentPromptVersion: "v2.2", knownWeaknesses: ["Broken PDF scanning", "Signoff failures"], toolUsage: [{ name: "DocuSign Check", count: 42 }, { name: "ERP Ingestion", count: 70 }] },
  { id: "knowledge_agent", name: "Knowledge Agent", role: "Vector DB & Indexing", status: "HEALTHY", memoryScore: 97, currentStrategy: "Dynamic Chunk Resizing", currentPromptVersion: "v4.0", knownWeaknesses: ["Vector collision", "Stale indexes"], toolUsage: [{ name: "Qdrant Indexer", count: 450 }, { name: "MD Parser", count: 320 }] },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<AgentData[]>(initialAgents);
  const [incidents, setIncidents] = useState<IncidentStep[]>([]);
  const [activeIncident, setActiveIncident] = useState<IncidentStep | null>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    knowledgeGrowth: 78,
    recoverySuccessRate: 98.4,
    avgRecoveryTimeSec: 4.8,
    strategyVersions: 14,
    memorySizeKb: 1240,
    reflectionCount: 42
  });
  const [securityData, setSecurityData] = useState<SecurityEventData>({
    promptInjectionScore: 0.02,
    secretScanStatus: "CLEAN",
    cvesFound: 0,
    riskScore: 12,
    sandboxStatus: "ACTIVE",
    approvalStatus: "APPROVED"
  });
  const [activeReflection, setActiveReflection] = useState<ReflectionData | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);
  const [activeGraphType, setActiveGraphType] = useState<"network" | "knowledge" | "propagation" | "strategy" | "dependency">("network");
  const [systemTime, setSystemTime] = useState<string>("");

  const fetchBackendState = async () => {
    try {
      const agentsRes = await fetch("/api/v1/agents");
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data.map((a: any) => {
          const match = initialAgents.find(ia => ia.id === a.id);
          return {
            id: a.id,
            name: a.name,
            role: a.description,
            status: a.status,
            memoryScore: match?.memoryScore || 90,
            currentStrategy: match?.currentStrategy || "Default Guardrails",
            currentPromptVersion: match?.currentPromptVersion || "v1.0",
            knownWeaknesses: match?.knownWeaknesses || ["Drift"],
            toolUsage: match?.toolUsage || [{ name: "HTTP Call", count: 12 }]
          };
        }));
      }

      const incidentsRes = await fetch("/api/v1/incidents");
      if (incidentsRes.ok) {
        const data = await incidentsRes.json();
        setIncidents(data.map((i: any) => ({
          id: i.id,
          agentId: i.agent_id,
          errorType: i.error_type,
          status: i.status,
          timestamp: new Date(i.timestamp).toLocaleTimeString("en-US", { hour12: false }),
          timeline: [
            { step: "Failure Detected", status: "completed", time: "0s" },
            { step: "Argus Monitoring", status: "completed", time: "1s" },
            { step: "Chiron Diagnosis", status: "completed", time: "2s" },
            { step: "Panacea Recovery", status: "completed", time: "3s" },
            { step: "Hygieia Security", status: "completed", time: "4s" },
            { step: "Phoenix Deployment", status: "completed", time: "5s" },
            { step: "Mnemosyne Memory", status: "completed", time: "6s" },
          ]
        })));
      }

      const metricsRes = await fetch("/api/v1/metrics");
      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data);
      }
    } catch (e) {
      // Offline fallback is active
    }
  };

  useEffect(() => {
    fetchBackendState();
    const interval = setInterval(fetchBackendState, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runSimulation = async (agentId: string, failureType: string) => {
    // Optimistically degrade status
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: "DEGRADED" } : a));

    const newIncidentId = `inc_${Math.random().toString(36).substr(2, 9)}`;
    const newIncident: IncidentStep = {
      id: newIncidentId,
      agentId,
      errorType: failureType,
      status: "OPEN",
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      timeline: [
        { step: "Failure Detected", status: "completed", time: "0s" },
        { step: "Argus Monitoring", status: "active", time: "..." },
        { step: "Chiron Diagnosis", status: "pending", time: "..." },
        { step: "Panacea Recovery", status: "pending", time: "..." },
        { step: "Hygieia Security", status: "pending", time: "..." },
        { step: "Phoenix Deployment", status: "pending", time: "..." },
        { step: "Mnemosyne Memory", status: "pending", time: "..." },
      ]
    };

    setActiveIncident(newIncident);
    setIncidents(prev => [newIncident, ...prev]);

    // Pipeline animations
    const workflowSteps = [
      { step: "Argus Monitoring", key: "Argus", delay: 800 },
      { step: "Chiron Diagnosis", key: "Chiron", delay: 1800 },
      { step: "Panacea Recovery", key: "Panacea", delay: 2800 },
      { step: "Hygieia Security", key: "Hygieia", delay: 3800 },
      { step: "Phoenix Deployment", key: "Phoenix", delay: 4800 },
      { step: "Mnemosyne Memory", key: "Mnemosyne", delay: 5800 },
    ];

    setActiveWorkflowStep("Argus");

    // Hit real FastAPI simulation engine
    try {
      await fetch(`/api/v1/simulation/run?agent_name=${agentId}&failure_type=${failureType}`, {
        method: "POST"
      });
    } catch (e) {
      console.log("FastAPI backend offline; running client-side simulation.");
    }

    for (const ws of workflowSteps) {
      await new Promise(resolve => setTimeout(resolve, ws.delay - (workflowSteps.find(w => w.key === activeWorkflowStep)?.delay || 0)));
      setActiveWorkflowStep(ws.key);

      // Trigger security events logs live display
      if (ws.key === "Hygieia") {
        setSecurityData({
          promptInjectionScore: 0.01,
          secretScanStatus: "CLEAN",
          cvesFound: 0,
          riskScore: 5,
          sandboxStatus: "ACTIVE",
          approvalStatus: "APPROVED"
        });
      }

      setActiveIncident(prev => {
        if (!prev) return null;
        return {
          ...prev,
          timeline: prev.timeline.map(t => {
            if (t.step === ws.step) {
              return { ...t, status: "completed", time: `${ws.delay / 1000}s` };
            }
            if (t.step === workflowSteps[workflowSteps.indexOf(ws) + 1]?.step) {
              return { ...t, status: "active" };
            }
            return t;
          })
        };
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: "LEARNING" } : a));
    setActiveWorkflowStep(null);

    // Reflection data update
    setActiveReflection({
      rootCause: failureType === "api_timeout" ? "Network Gateway Timeout" : "Model Drift & Safety Failure",
      chosenStrategy: failureType === "api_timeout" ? "Adaptive TCP Backoff v2" : "System Prompt Alignment",
      confidence: 0.95,
      reason: "Prior resolution match found in MNEMOSYNE memory store.",
      lessonsLearned: "Cascading failure avoided by isolating API endpoints.",
      recommendations: "Enable strategy version auto-promotion to all network nodes."
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: "HEALTHY", memoryScore: Math.min(100, a.memoryScore + 2) } : a));

    // Refresh database state
    fetchBackendState();

    setActiveIncident(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: "RESOLVED",
        timeline: prev.timeline.map(t => ({ ...t, status: "completed" as const }))
      };
    });
  };

  const runReplay = (incidentId: string) => {
    const target = incidents.find(i => i.id === incidentId);
    if (target) {
      runSimulation(target.agentId, target.errorType);
    }
  };

  const clearActiveIncident = () => {
    setActiveIncident(null);
  };

  return (
    <AppContext.Provider value={{
      agents,
      incidents,
      activeIncident,
      activeWorkflowStep,
      metrics,
      selectedAgent,
      setSelectedAgent,
      activeGraphType,
      setActiveGraphType,
      runSimulation,
      clearActiveIncident,
      systemTime,
      securityData,
      activeReflection,
      runReplay
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};

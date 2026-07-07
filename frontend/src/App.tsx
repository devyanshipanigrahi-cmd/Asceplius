import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { TopNav } from "./components/TopNav";
import { IncidentFeed } from "./components/IncidentFeed";
import { NetworkGraph } from "./components/NetworkGraph";
import { ImmuneResponsePipeline } from "./components/ImmuneResponsePipeline";
import { EvolutionDashboard } from "./components/EvolutionDashboard";
import { AgentDetails } from "./components/AgentDetails";
import { CommandPalette } from "./components/CommandPalette";

const DashboardLayout: React.FC = () => {
  const { selectedAgent, setSelectedAgent } = useApp();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-graphite text-zinc-100 overflow-hidden font-sans">
      {/* Top Header */}
      <TopNav onOpenPalette={() => setIsPaletteOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Incident Feeds */}
        <IncidentFeed />

        {/* Center Canvas: Interactive React Flow network */}
        <div className="flex-1 relative flex flex-col">
          <NetworkGraph />
          {/* Right Floating Drawer inside Canvas */}
          <AgentDetails 
            agent={selectedAgent} 
            onClose={() => setSelectedAgent(null)} 
          />
        </div>

        {/* Right Side: Active pipeline details */}
        <ImmuneResponsePipeline />
      </div>

      {/* Bottom evolution log and graphs */}
      <EvolutionDashboard />

      {/* Keyboard control palette overlay */}
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}

export default App;

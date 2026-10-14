import React, { useState, useEffect } from 'react';
import { Navbar, NavSection } from './components/Navbar';
import { DashboardSection } from './components/DashboardSection';
import { ConfigurationSection } from './components/ConfigurationSection';
import { SimulatorSection } from './components/SimulatorSection';
import { ResultsSection } from './components/ResultsSection';
import { TraceTableSection } from './components/TraceTableSection';
import { TestCasesSection } from './components/TestCasesSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { SimulationResult } from './types/moore';
import { simulateMooreMachine } from './utils/mooreMachine';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [currentInput, setCurrentInput] = useState<string>('10110');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Initialize with default simulation on mount
  useEffect(() => {
    const defaultResult = simulateMooreMachine('10110');
    setSimulationResult(defaultResult);
  }, []);

  const handleQuickSimulate = () => {
    const input = '10110';
    setCurrentInput(input);
    const result = simulateMooreMachine(input);
    setSimulationResult(result);
    setActiveSection('simulator');
  };

  const handleRunSample = (sampleInput: string) => {
    setCurrentInput(sampleInput);
    const result = simulateMooreMachine(sampleInput);
    setSimulationResult(result);
    setActiveSection('simulator');
  };

  const handleLoadAndRunTestCase = (input: string) => {
    setCurrentInput(input);
    const result = simulateMooreMachine(input);
    setSimulationResult(result);
    setActiveSection('simulator');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={(sec) => setActiveSection(sec)}
        onQuickSimulate={handleQuickSimulate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeSection === 'dashboard' && (
          <DashboardSection
            onStartSimulation={() => setActiveSection('simulator')}
            onNavigateToSection={(sec) => setActiveSection(sec)}
            onRunSample={handleRunSample}
          />
        )}

        {activeSection === 'configuration' && (
          <ConfigurationSection
            onLoadIntoSimulator={handleRunSample}
          />
        )}

        {activeSection === 'simulator' && (
          <SimulatorSection
            currentInput={currentInput}
            onInputChange={setCurrentInput}
            simulationResult={simulationResult}
            onSimulationComplete={setSimulationResult}
            onNavigateToResults={() => setActiveSection('results')}
          />
        )}

        {activeSection === 'results' && (
          <ResultsSection
            result={simulationResult}
            onNavigateToSimulator={() => setActiveSection('simulator')}
            onNavigateToTrace={() => setActiveSection('trace')}
          />
        )}

        {activeSection === 'trace' && (
          <TraceTableSection
            result={simulationResult}
            onNavigateToSimulator={() => setActiveSection('simulator')}
          />
        )}

        {activeSection === 'testcases' && (
          <TestCasesSection
            onLoadAndRunTestCase={handleLoadAndRunTestCase}
          />
        )}

        {activeSection === 'about' && (
          <AboutSection />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

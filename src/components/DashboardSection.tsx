import React from 'react';
import { ArrowRight, Cpu, Layers, PlayCircle, GitCommit, CheckCircle, HelpCircle } from 'lucide-react';
import { StateDiagram } from './StateDiagram';

interface DashboardSectionProps {
  onStartSimulation: () => void;
  onNavigateToSection: (section: any) => void;
  onRunSample: (input: string) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  onStartSimulation,
  onNavigateToSection,
  onRunSample,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        {/* Background ambient radial highlight */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping inline-block" />
              Theory of Computation Project · FSM Transducer
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance leading-tight">
              Moore Machine Simulator
            </h1>

            <p className="text-lg font-medium text-indigo-300">
              Interactive State-Based Binary String Simulator
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In formal language theory, a <strong>Moore Machine</strong> is a finite-state machine whose output values are determined solely by its current state. Unlike Mealy machines where outputs depend on transitions, a Moore machine emits an output symbol immediately upon entering any state—including the initial state before reading the first input symbol.
            </p>

            {/* Project Objective Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-sm space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Project Problem Statement
              </div>
              <p className="text-slate-200 italic font-mono text-xs sm:text-sm">
                &ldquo;Build a Moore Machine interpreter where outputs are tied strictly to states. Output the calculated string sequence for a given binary input.&rdquo;
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartSimulation}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 group"
              >
                <span>START SIMULATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToSection('configuration')}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/80 transition-colors"
              >
                View Machine Spec
              </button>
            </div>

            {/* Quick stats or convention note */}
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-3">
              <span className="text-indigo-400 font-semibold">Important Convention:</span>
              <span>Input length <strong className="text-slate-200">n</strong> produces output length <strong className="text-slate-200">n + 1</strong> (includes λ(q0)).</span>
            </div>
          </div>

          {/* Interactive State Diagram Preview on Hero */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>Machine Topology (Q = {'{q0, q1, q2}'})</span>
                <span className="text-indigo-400">Interactive Preview</span>
              </div>
              <StateDiagram currentState="q0" interactive={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Core Simulation Capabilities</h2>
          <p className="text-sm text-slate-400 mt-1">Engineered to academic standards for Theory of Computation coursework.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-900/60 transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">State-Based Output</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Outputs are strictly mapped directly to states via &lambda;(q). State q0 &#8614; 0, q1 &#8614; 1, q2 &#8614; 0. No output is dependent on input transitions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-900/60 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Binary Input Processing</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Robust syntax and alphabet validation over &Sigma; = {'{0, 1}'}. Identifies illegal symbols, non-binary characters, and empty strings with exact indices.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-900/60 transition-colors">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Step-by-Step Simulation</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Full playback control suite: Play, Pause, Step Forward, Step Back, and Reset with a live virtual tape reader head advancing symbol by symbol.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-900/60 transition-colors">
              <GitCommit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Visual State Transitions</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dynamic SVG graph dynamically illuminates the active state circle, self-loops, and transition paths with directional glowing indicators.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-900/60 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Result Analysis & Trace</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete diagnostic reports including state sequences, output streams, transitions tally, and an interactive trace table linked to step execution.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-4 group-hover:bg-rose-900/60 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Theory & Viva Preparation</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Curated exam and viva defense section comparing Moore vs. Mealy machines, formal 6-tuple mathematical proofs, and model conversion principles.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Test Scenarios */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Quick Run Presets</h4>
          <p className="text-xs text-slate-400">Jump directly into the simulator with verified test inputs:</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: '0 (Len 1)', val: '0' },
            { label: '1 (Len 1)', val: '1' },
            { label: '10110 (Default)', val: '10110' },
            { label: '00000 (5 Zeros)', val: '00000' },
            { label: '11111 (5 Ones)', val: '11111' },
            { label: '101010101010 (Len 12)', val: '101010101010' },
            { label: '20 Zeros (Len 20)', val: '00000000000000000000' },
            { label: '20 Ones (Len 20)', val: '11111111111111111111' },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => onRunSample(preset.val)}
              className="px-3 py-1.5 text-xs font-mono font-semibold bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SimulationResult } from '../types/moore';
import { Copy, Check, Download, ArrowRight, Activity, Hash, CheckCircle2, RotateCcw } from 'lucide-react';

interface ResultsSectionProps {
  result: SimulationResult | null;
  onNavigateToSimulator: () => void;
  onNavigateToTrace: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  result,
  onNavigateToSimulator,
  onNavigateToTrace,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!result || !result.isValid) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No Simulation Results Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Run a binary string simulation in the Simulator to inspect computed state sequences, output streams, and analytical metrics.
        </p>
        <button
          onClick={onNavigateToSimulator}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
        >
          <span>Go to Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadReport = () => {
    const report = {
      project: "Moore Machine Simulator (Theory of Computation)",
      inputString: result.inputString,
      inputLength: result.inputLength,
      initialState: result.initialState,
      initialStateOutput: result.initialStateOutput,
      stateSequence: result.stateSequence,
      stateSequenceLength: result.stateSequenceLength,
      symbolProcessedOutputSequence: result.symbolProcessedOutputSequence,
      outputSequence: result.outputSequence,
      outputLength: result.outputSequence.length,
      finalState: result.finalState,
      transitionsCount: result.transitionsCount,
      statesVisitedCount: result.statesVisitedCount,
      uniqueStatesUsed: result.uniqueStatesUsed,
      uniqueStatesCount: result.uniqueStatesCount,
      initialStateIncluded: true,
      timestamp: new Date(result.timestamp).toISOString(),
      traceSteps: result.steps.map(s => ({
        step: s.step,
        input: s.inputSymbol,
        currentState: s.currentState,
        nextState: s.nextState,
        output: s.outputSymbol,
        description: s.description,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moore_machine_report_${result.inputString}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Section 4 · Verification & Diagnostics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Simulation Results Summary
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic computational outcome for input sequence <code className="text-cyan-300 font-mono font-bold">{result.inputString}</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onNavigateToTrace}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <span>View Trace Table</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400">Input Length (N)</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {result.inputLength}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Binary Symbols</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400">Transitions (N)</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-purple-400 mt-1">
            {result.transitionsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">State Transitions</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400">State Seq Length</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-400 mt-1">
            {result.stateSequenceLength}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">N + 1 States (q0 + ...)</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400">Unique States Used</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            {result.uniqueStatesCount} / 3
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{result.uniqueStatesUsed.join(', ')}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400">Initial State & Out</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white mt-1">
            {result.initialState} <span className="text-amber-400 text-lg">/ {result.initialStateOutput}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Start Node</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="text-[11px] font-medium text-slate-400">Final State</div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-300 mt-1">
            {result.finalState}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">λ({result.finalState}) = {result.outputSequence[result.outputSequence.length - 1]}</div>
        </div>
      </div>

      {/* Output Convention Distinction (Requirement 3) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Moore Output Convention Breakdown
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            Initial Output vs. Output After Each Input Symbol vs. Complete Moore Sequence
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            In Moore machines, output is strictly determined by state values (λ: Q → Δ), not transitions. The initial state {result.initialState} emits output 0 before reading any input symbols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* A. Initial State Output */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">A. Initial State Output</span>
              <span className="font-mono text-indigo-400">Step 0 (pre-input)</span>
            </div>
            <div className="font-mono text-2xl font-extrabold text-indigo-300 p-2 bg-indigo-950/40 rounded-lg text-center border border-indigo-900/50">
              {result.initialStateOutput}
            </div>
            <p className="text-[11px] text-slate-400">
              Emitted by start state <code className="text-indigo-300 font-mono">{result.initialState}</code> before processing symbol 0 of input.
            </p>
          </div>

          {/* B. Output After Each Input Symbol */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">B. Output After Each Input Symbol</span>
              <button
                onClick={() => handleCopy(result.symbolProcessedOutputSequence, 'perSymbol')}
                className="p-1 text-slate-400 hover:text-slate-200 rounded"
                title="Copy output after each input symbol"
              >
                {copiedField === 'perSymbol' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-xl font-extrabold text-cyan-300 p-2 bg-cyan-950/40 rounded-lg text-center border border-cyan-900/50 break-all max-h-24 overflow-y-auto">
              {result.symbolProcessedOutputSequence}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Length: <strong className="text-slate-200">{result.symbolProcessedOutputSequence.length}</strong> (N)</span>
              <span>Steps 1 to {result.inputLength}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generated strictly from each state reached (λ(q0)=0, λ(q1)=1, λ(q2)=0) after processing each symbol.
            </p>
          </div>

          {/* C. Complete Moore Output Sequence */}
          <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/50 space-y-2 ring-1 ring-amber-500/20">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="font-semibold">C. Complete Moore Output (A + B)</span>
              <button
                onClick={() => handleCopy(result.outputSequence, 'complete')}
                className="p-1 text-amber-400 hover:text-amber-200 rounded"
                title="Copy complete sequence"
              >
                {copiedField === 'complete' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-xl font-extrabold text-amber-300 p-2 bg-amber-950/40 rounded-lg text-center border border-amber-900/50 break-all max-h-24 overflow-y-auto">
              {result.outputSequence}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Length: <strong className="text-amber-300 font-bold">{result.outputSequence.length}</strong> (N + 1)</span>
              <span>All Steps 0 to {result.inputLength}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Includes initial output λ(q0)=0 concatenated with outputs after each symbol.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Output Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Sequence Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Full State Sequence</h3>
              <p className="text-xs text-slate-400">Complete sequence of states traversed including start state q0</p>
            </div>
            <button
              onClick={() => handleCopy(result.stateSequence.join(' -> '), 'states')}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedField === 'states' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'states' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-sm text-slate-200 max-h-60 overflow-y-auto">
            {result.stateSequence.length <= 100 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {result.stateSequence.map((st, i) => (
                  <React.Fragment key={i}>
                    <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                      i === 0
                        ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/60'
                        : i === result.stateSequence.length - 1
                        ? 'bg-purple-900/60 text-purple-200 border border-purple-700/60'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {st}
                    </span>
                    {i < result.stateSequence.length - 1 && (
                      <span className="text-slate-600 font-bold text-xs">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="break-all leading-relaxed whitespace-pre-wrap">
                {result.stateSequence.join(' ➔ ')}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>State Sequence Length: <strong className="text-white">{result.stateSequenceLength}</strong> (N + 1)</span>
            <span>Unique States: <strong className="text-white">{result.uniqueStatesUsed.join(', ')}</strong> ({result.uniqueStatesCount} of 3)</span>
          </div>
        </div>

        {/* Complete Moore Output Sequence Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Complete Moore Output Sequence</h3>
              <p className="text-xs text-slate-400">Strictly state-dependent emitted stream ({result.outputSequence.length} symbols)</p>
            </div>
            <button
              onClick={() => handleCopy(result.outputSequence, 'output')}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedField === 'output' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'output' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xl sm:text-2xl tracking-widest text-amber-300 font-bold break-all max-h-60 overflow-y-auto leading-relaxed select-all">
            {result.outputSequence}
          </div>

          {/* Academic Moore Convention Callout */}
          <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300">Moore Property Formally Verified:</strong> Input length <code className="text-amber-300 font-bold">{result.inputLength}</code> (N) yields <code className="text-amber-300 font-bold">{result.transitionsCount}</code> transitions and <code className="text-amber-300 font-bold">{result.outputSequence.length}</code> output characters (N + 1). Initial output <code className="bg-amber-950/80 px-1 py-0.5 rounded text-amber-300 font-bold">0</code> is from λ(q0).
          </div>
        </div>
      </div>

      {/* Validation Status & Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Validation Status: VALID BINARY SEQUENCE</div>
            <div className="text-xs text-slate-400">All characters conform to binary alphabet Σ = {'{0, 1}'} with deterministic execution.</div>
          </div>
        </div>

        <button
          onClick={onNavigateToSimulator}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Simulate Another Input</span>
        </button>
      </div>
    </div>
  );
};

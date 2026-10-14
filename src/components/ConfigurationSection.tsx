import React, { useState } from 'react';
import { StateDiagram } from './StateDiagram';
import { MACHINE_STATES, TRANSITIONS } from '../utils/mooreMachine';
import { StateId } from '../types/moore';
import { ArrowRight, Info, Check, Sparkles } from 'lucide-react';

interface ConfigurationSectionProps {
  onLoadIntoSimulator: (input: string) => void;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
  onLoadIntoSimulator,
}) => {
  const [selectedState, setSelectedState] = useState<StateId>('q0');
  const [testSymbol, setTestSymbol] = useState<'0' | '1'>('1');

  // Compute immediate next state for interactive exploration
  const activeRule = TRANSITIONS.find(
    (t) => t.fromState === selectedState && t.input === testSymbol
  );

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
          Section 2 · Formal Specification
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Moore Machine Configuration
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          The Moore machine is mathematically formalized as a 6-tuple <code className="text-indigo-300 font-mono">M = (Q, Σ, Δ, δ, λ, q0)</code> where outputs are associated strictly with states.
        </p>
      </div>

      {/* 6-Tuple Formal Definition Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">States (Q)</div>
          <div className="text-base font-bold font-mono text-indigo-300 mt-0.5">{'{q0, q1, q2}'}</div>
          <div className="text-[11px] text-slate-400 mt-1">3 Finite States</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Input Alphabet (Σ)</div>
          <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">{'{0, 1}'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Binary Input Symbols</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Output Alphabet (Δ)</div>
          <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">{'{0, 1}'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Binary Output Symbols</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Transition Func (δ)</div>
          <div className="text-base font-bold font-mono text-purple-300 mt-0.5">Q × Σ → Q</div>
          <div className="text-[11px] text-slate-400 mt-1">Deterministic Next State</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Output Func (λ)</div>
          <div className="text-base font-bold font-mono text-amber-300 mt-0.5">Q → Δ</div>
          <div className="text-[11px] text-slate-400 mt-1">Strict State Mapping</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">Initial State (q0)</div>
          <div className="text-base font-bold font-mono text-rose-300 mt-0.5">q0</div>
          <div className="text-[11px] text-slate-400 mt-1">Starting Node</div>
        </div>
      </div>

      {/* Main Two-Column Layout: Transition Table + Interactive State Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tables & State Specs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Transition Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Transition & Output Table</h3>
                <p className="text-xs text-slate-400">Deterministic Next State δ(q, a) and Output λ(q)</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/80 rounded">
                Moore Model
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <th className="py-3 px-3">Current State (q)</th>
                    <th className="py-3 px-3 text-center">Input 0 [δ(q, 0)]</th>
                    <th className="py-3 px-3 text-center">Input 1 [δ(q, 1)]</th>
                    <th className="py-3 px-3 text-right">Output [λ(q)]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr
                    onClick={() => setSelectedState('q0')}
                    className={`cursor-pointer transition-colors ${
                      selectedState === 'q0' ? 'bg-indigo-950/40 text-white font-bold' : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <span>q0 (Initial)</span>
                    </td>
                    <td className="py-3 px-3 text-center text-cyan-300">q0</td>
                    <td className="py-3 px-3 text-center text-cyan-300">q1</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300">0</td>
                  </tr>

                  <tr
                    onClick={() => setSelectedState('q1')}
                    className={`cursor-pointer transition-colors ${
                      selectedState === 'q1' ? 'bg-indigo-950/40 text-white font-bold' : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span>q1</span>
                    </td>
                    <td className="py-3 px-3 text-center text-cyan-300">q2</td>
                    <td className="py-3 px-3 text-center text-cyan-300">q1</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300">1</td>
                  </tr>

                  <tr
                    onClick={() => setSelectedState('q2')}
                    className={`cursor-pointer transition-colors ${
                      selectedState === 'q2' ? 'bg-indigo-950/40 text-white font-bold' : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span>q2</span>
                    </td>
                    <td className="py-3 px-3 text-center text-cyan-300">q0</td>
                    <td className="py-3 px-3 text-center text-cyan-300">q1</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Note: In this Moore machine, the output is listed in its own column because it depends solely on the current state. Contrast this with Mealy machines where the output would be inside each input transition column.
              </span>
            </div>
          </div>

          {/* Interactive State Inspector */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Interactive State & Transition Tester
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">Select State:</span>
                {(['q0', 'q1', 'q2'] as StateId[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                      selectedState === st
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">Test Input:</span>
                {(['0', '1'] as const).map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setTestSymbol(sym)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                      testSymbol === sym
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* Dynamic Rule Output */}
              {activeRule && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>δ({selectedState}, {testSymbol})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-cyan-300 font-bold">{activeRule.toState}</span>
                  </div>
                  <div className="text-slate-400">
                    Output emitted: <span className="text-amber-300 font-bold">λ({activeRule.toState}) = {MACHINE_STATES[activeRule.toState].output}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visual State Diagram */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Visual Transition Diagram</h3>
            <span className="text-xs text-slate-400">Click node to inspect</span>
          </div>

          <StateDiagram
            currentState={selectedState}
            activeTransitionKey={activeRule ? `${selectedState}-${testSymbol}->${activeRule.toState}` : null}
            onSelectState={setSelectedState}
            interactive={true}
          />

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200">Diagram Legend:</div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">q0:</strong> Initial state with inbound Start arrow. Loops on 0, advances to q1 on 1. Output: 0.</li>
              <li><strong className="text-slate-200">q1:</strong> Loops on 1, moves to alternate state q2 on 0. Output: 1.</li>
              <li><strong className="text-slate-200">q2:</strong> Resets to q0 on 0, transitions to q1 on 1. Output: 0.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

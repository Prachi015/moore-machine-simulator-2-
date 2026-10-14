import React, { useState } from 'react';
import { BookOpen, HelpCircle, Check, ChevronDown, ChevronUp, Layers, Cpu, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: '1. What is the formal mathematical 6-tuple definition of a Moore Machine?',
      a: 'A Moore Machine is defined as M = (Q, Σ, Δ, δ, λ, q0), where Q is a finite non-empty set of states, Σ is the finite input alphabet, Δ is the finite output alphabet, δ: Q × Σ → Q is the transition function, λ: Q → Δ is the output function mapping each state to an output symbol, and q0 ∈ Q is the start/initial state.',
    },
    {
      q: '2. Why does an input of length n produce an output of length n + 1 in a Moore Machine?',
      a: 'In a Moore Machine, output is tied strictly to the state itself (λ(q)). When the machine is initialized in state q0 prior to reading the first input symbol, it immediately emits the output λ(q0). Then, for each of the n transitions triggered by input symbols, it enters a state and emits another output. Hence, total outputs = 1 (initial) + n (transitions) = n + 1.',
    },
    {
      q: '3. What is the fundamental difference between Moore and Mealy machines?',
      a: 'In a Moore Machine, output depends solely on the current state (λ: Q → Δ). In a Mealy Machine, output depends on both the current state and the current input symbol (λ: Q × Σ → Δ). Consequently, Mealy machine outputs change on input transitions and have length n for input length n, whereas Moore machine outputs change only when states change and have length n + 1.',
    },
    {
      q: '4. Can every Moore Machine be converted into an equivalent Mealy Machine?',
      a: 'Yes! Any Moore machine can be converted into an equivalent Mealy machine by transferring the output associated with each target state directly onto the incoming transition arrows. In reverse, a Mealy machine can be converted into a Moore machine, but the number of states may increase because states may need to be split to accommodate differing outputs.',
    },
    {
      q: '5. What is the hardware engineering advantage of a Moore Machine over a Mealy Machine?',
      a: 'Because Moore machine outputs are tied solely to state flip-flops and do not depend directly on combinational input signals, they are immune to input signal glitches and clock skew hazards. Moore outputs are fully synchronous with clock cycles, making them widely favored in digital circuit design and synchronous control logic.',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
          Section 7 · Academic Theory & Viva Guide
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Theory of Computation: Moore Machine Foundations
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive curriculum notes designed for undergraduate examinations, laboratory viva voce, and conceptual mastery.
        </p>
      </div>

      {/* Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What is an FSM */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">What is a Finite State Machine (FSM)?</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A <strong>Finite State Machine (FSM)</strong> or finite automaton is a computational model consisting of a finite number of internal states, an input alphabet, and transition rules. When an FSM generates output symbols rather than merely accepting or rejecting strings, it is termed a <strong>Finite State Transducer (FST)</strong>.
          </p>
        </div>

        {/* Card 2: What is a Moore Machine */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">What is a Moore Machine?</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Introduced by mathematician Edward F. Moore in his seminal 1956 paper <em>&ldquo;Gedanken-experiments on Sequential Machines&rdquo;</em>, a Moore Machine is an FSM whose output value at any time depends strictly and solely on its current state. The transition logic guides state changes, while the state directly prescribes the emitted output symbol.
          </p>
        </div>
      </div>

      {/* Moore vs Mealy Comparison Matrix */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Moore Machine vs. Mealy Machine: Direct Comparison</h3>
          <p className="text-xs text-slate-400">Key differences commonly examined in college theory tests</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase font-mono">
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4 text-indigo-300">Moore Machine (Current App)</th>
                <th className="py-3 px-4 text-slate-300">Mealy Machine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Output Dependency</td>
                <td className="py-3 px-4 font-mono text-indigo-300">λ: Q → Δ (State only)</td>
                <td className="py-3 px-4 font-mono text-slate-300">λ: Q × Σ → Δ (State & Input)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Output String Length</td>
                <td className="py-3 px-4 text-indigo-300 font-mono font-bold">n + 1 (for input length n)</td>
                <td className="py-3 px-4 text-slate-300 font-mono">n (for input length n)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Initial State Output</td>
                <td className="py-3 px-4 text-indigo-300">Yes, λ(q0) is emitted at start</td>
                <td className="py-3 px-4 text-slate-300">No, output requires an input transition</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">Hardware Timing</td>
                <td className="py-3 px-4 text-indigo-300">Synchronous, glitch-free on clock edge</td>
                <td className="py-3 px-4 text-slate-300">Asynchronous ripple, susceptible to glitches</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-slate-200">State Count</td>
                <td className="py-3 px-4 text-indigo-300">Often requires more states to represent same logic</td>
                <td className="py-3 px-4 text-slate-300">Generally fewer states</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Walkthrough Example */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Walkthrough: How 10110 is Processed</h3>

        <div className="space-y-3 text-xs sm:text-sm font-mono text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span><strong>Step 0:</strong> Initial start at <code className="text-indigo-400">q0</code> before input</span>
            <span className="text-amber-300">Output: 0 (from λ(q0))</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span><strong>Step 1:</strong> Read &lsquo;1&rsquo; ➔ δ(q0, 1) = <code className="text-indigo-400">q1</code></span>
            <span className="text-amber-300">Output: 1 (from λ(q1))</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span><strong>Step 2:</strong> Read &lsquo;0&rsquo; ➔ δ(q1, 0) = <code className="text-indigo-400">q2</code></span>
            <span className="text-amber-300">Output: 0 (from λ(q2))</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span><strong>Step 3:</strong> Read &lsquo;1&rsquo; ➔ δ(q2, 1) = <code className="text-indigo-400">q1</code></span>
            <span className="text-amber-300">Output: 1 (from λ(q1))</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span><strong>Step 4:</strong> Read &lsquo;1&rsquo; ➔ δ(q1, 1) = <code className="text-indigo-400">q1</code> (self-loop)</span>
            <span className="text-amber-300">Output: 1 (from λ(q1))</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span><strong>Step 5:</strong> Read &lsquo;0&rsquo; ➔ δ(q1, 0) = <code className="text-indigo-400">q2</code></span>
            <span className="text-amber-300">Output: 0 (from λ(q2))</span>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs text-indigo-200 font-mono">
          Final State: <strong className="text-white">q2</strong> · Output Sequence: <strong className="text-amber-300">010110</strong> (Length 6 = 5 + 1)
        </div>
      </div>

      {/* College Viva Voce Accordion */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>High-Frequency College Viva Questions & Model Answers</span>
          </h3>
          <p className="text-xs text-slate-400">Master these 5 core questions for viva defense</p>
        </div>

        <div className="space-y-2.5">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-3 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

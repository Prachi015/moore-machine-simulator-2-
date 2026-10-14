import React, { useState } from 'react';
import { SimulationResult } from '../types/moore';
import { Table, Copy, Check, Download, ArrowRight } from 'lucide-react';

interface TraceTableSectionProps {
  result: SimulationResult | null;
  onNavigateToSimulator: () => void;
}

export const TraceTableSection: React.FC<TraceTableSectionProps> = ({
  result,
  onNavigateToSimulator,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllRows, setShowAllRows] = useState(false);
  const pageSize = 50;

  if (!result || !result.isValid) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Table className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No Trace Data Available</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Execute a simulation in the Simulator to generate the step-by-step trace table.
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

  const handleCopyTable = () => {
    const headers = ['Step', 'Input', 'Current State', 'Next State', 'Output', 'Description'];
    const rows = result.steps.map((s) => [
      s.step,
      s.inputSymbol,
      s.currentState,
      s.nextState,
      s.outputSymbol,
      s.description,
    ]);
    const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['Step', 'Input', 'Current State', 'Next State', 'Output', 'Description'];
    const rows = result.steps.map((s) => [
      s.step,
      `"${s.inputSymbol}"`,
      `"${s.currentState}"`,
      `"${s.nextState}"`,
      `"${s.outputSymbol}"`,
      `"${s.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moore_trace_${result.inputString}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Section 5 · Step-by-Step Trace
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Execution Trace Table
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Detailed transition log for binary input <code className="text-cyan-300 font-mono font-bold">{result.inputString}</code>. Moore outputs are tied strictly to states (λ(q0)=0, λ(q1)=1, λ(q2)=0), never to transitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {result.steps.length > pageSize && (
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              {showAllRows ? `Paginate (${pageSize}/page)` : `Show All (${result.steps.length} rows)`}
            </button>
          )}

          <button
            onClick={handleCopyTable}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Copy entire table to clipboard as TSV"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All TSV'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Download full trace as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Pagination Controls Bar for large results */}
      {result.steps.length > pageSize && !showAllRows && (
        <div className="flex items-center justify-between text-xs font-mono bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl">
          <div className="text-slate-400">
            Showing steps <strong className="text-white">{(currentPage - 1) * pageSize}</strong> to <strong className="text-white">{Math.min(currentPage * pageSize - 1, result.steps.length - 1)}</strong> of <strong className="text-white">{result.steps.length}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              « First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              ‹ Prev
            </button>
            <span className="px-2 text-indigo-400 font-bold">
              Page {currentPage} of {Math.ceil(result.steps.length / pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(result.steps.length / pageSize), prev + 1))}
              disabled={currentPage === Math.ceil(result.steps.length / pageSize)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              Next ›
            </button>
            <button
              onClick={() => setCurrentPage(Math.ceil(result.steps.length / pageSize))}
              disabled={currentPage === Math.ceil(result.steps.length / pageSize)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              Last »
            </button>
          </div>
        </div>
      )}

      {/* Trace Table Container */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead className="sticky top-0 bg-slate-950 z-10 shadow-sm">
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center">Step</th>
                <th className="py-3.5 px-4 text-center">Input Symbol</th>
                <th className="py-3.5 px-4 text-center">Current State</th>
                <th className="py-3.5 px-4 text-center">Next State</th>
                <th className="py-3.5 px-4 text-center">State Output λ(q)</th>
                <th className="py-3.5 px-6 font-sans">Formal Transition Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(showAllRows || result.steps.length <= pageSize
                ? result.steps
                : result.steps.slice((currentPage - 1) * pageSize, currentPage * pageSize)
              ).map((step) => {
                const isInitial = step.step === 0;

                return (
                  <tr
                    key={step.step}
                    className={`transition-colors ${
                      isInitial
                        ? 'bg-indigo-950/20 hover:bg-indigo-950/30'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Step Number */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        isInitial ? 'bg-indigo-900/60 text-indigo-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {step.step}
                      </span>
                    </td>

                    {/* Input Symbol */}
                    <td className="py-3 px-4 text-center">
                      {isInitial ? (
                        <span className="text-slate-500 font-bold">-</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-bold text-xs">
                          {step.inputSymbol}
                        </span>
                      )}
                    </td>

                    {/* Current State */}
                    <td className="py-3 px-4 text-center text-slate-200 font-semibold">
                      {step.currentState}
                    </td>

                    {/* Next State */}
                    <td className="py-3 px-4 text-center">
                      {isInitial ? (
                        <span className="text-slate-500">-</span>
                      ) : (
                        <span className="text-purple-300 font-bold">
                          {step.nextState}
                        </span>
                      )}
                    </td>

                    {/* Output */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        step.outputSymbol === '1'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {step.outputSymbol}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-6 font-sans text-xs sm:text-sm text-slate-300">
                      {step.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Trace Table Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="space-y-0.5">
            <div>
              Showing <strong className="text-white">{result.steps.length}</strong> total trace steps (<strong className="text-white">1</strong> initial condition step + <strong className="text-white">{result.transitionsCount}</strong> transitions).
            </div>
            <div className="text-[11px] text-slate-500">
              Input Length N = <strong className="text-slate-300">{result.inputLength}</strong> | Transitions = <strong className="text-slate-300">{result.transitionsCount}</strong> | State Sequence = <strong className="text-slate-300">{result.stateSequenceLength}</strong> (N+1) | Complete Output = <strong className="text-amber-300">{result.outputSequenceLength}</strong> (N+1)
            </div>
          </div>
          <div className="font-mono text-slate-300 whitespace-nowrap self-end md:self-auto">
            Final State: <span className="text-indigo-400 font-bold">{result.finalState}</span> (Output: <span className="text-amber-300 font-bold">{result.outputSequence[result.outputSequence.length - 1]}</span>)
          </div>
        </div>
      </div>
    </div>
  );
};

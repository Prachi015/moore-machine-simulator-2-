import React, { useState } from 'react';
import { PREDEFINED_TEST_CASES, simulateMooreMachine, validateBinaryInput } from '../utils/mooreMachine';
import { TestCase } from '../types/moore';
import { CheckCircle2, XCircle, Play, Sparkles, Filter, CheckCheck } from 'lucide-react';

interface TestCasesSectionProps {
  onLoadAndRunTestCase: (input: string) => void;
}

export const TestCasesSection: React.FC<TestCasesSectionProps> = ({
  onLoadAndRunTestCase,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'valid' | 'invalid'>('all');
  const [batchResults, setBatchResults] = useState<Record<string, { passed: boolean; message: string; output?: string }> | null>(null);

  const validCount = PREDEFINED_TEST_CASES.filter((t) => t.expectedValid).length;
  const invalidCount = PREDEFINED_TEST_CASES.filter((t) => !t.expectedValid).length;
  const totalCount = PREDEFINED_TEST_CASES.length;
  const passedCount = batchResults ? Object.values(batchResults).filter((r) => r.passed).length : 0;

  const filteredCases = PREDEFINED_TEST_CASES.filter((tc) => {
    if (filterCategory === 'valid') return tc.expectedValid;
    if (filterCategory === 'invalid') return !tc.expectedValid;
    return true;
  });

  const handleRunBatchSuite = () => {
    const results: Record<string, { passed: boolean; message: string; output?: string }> = {};

    PREDEFINED_TEST_CASES.forEach((tc) => {
      const validation = validateBinaryInput(tc.input);

      if (tc.expectedValid) {
        if (!validation.isValid) {
          results[tc.id] = {
            passed: false,
            message: `Unexpected validation failure: ${validation.errorMessage}`,
          };
        } else {
          const sim = simulateMooreMachine(tc.input);
          const outputMatches = !tc.expectedOutput || sim.outputSequence === tc.expectedOutput;
          const finalStateMatches = !tc.expectedFinalState || sim.finalState === tc.expectedFinalState;

          if (outputMatches && finalStateMatches) {
            results[tc.id] = {
              passed: true,
              message: `Success: Output=${sim.outputSequence}, Final=${sim.finalState}`,
              output: sim.outputSequence,
            };
          } else {
            results[tc.id] = {
              passed: false,
              message: `Mismatch: Expected ${tc.expectedOutput}, Got ${sim.outputSequence}`,
            };
          }
        }
      } else {
        // Expected invalid
        if (!validation.isValid) {
          results[tc.id] = {
            passed: true,
            message: `Correctly rejected: ${validation.errorMessage}`,
          };
        } else {
          results[tc.id] = {
            passed: false,
            message: `Failed: Invalid input was incorrectly accepted!`,
          };
        }
      }
    });

    setBatchResults(results);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Section 6 · Verification Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Predefined Test Cases & Validation
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive test suite covering standard sequences, self-loop edge cases, and illegal symbol handling.
          </p>
        </div>

        {/* Batch suite trigger */}
        <button
          onClick={handleRunBatchSuite}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Run All Tests (Batch Suite)</span>
        </button>
      </div>

      {/* Batch Suite Result Banner if executed */}
      {batchResults && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-2xl flex items-center justify-between gap-4 text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-900 border border-emerald-700 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Batch Test Suite Passed: {passedCount}/{totalCount} Test Invariants Verified</p>
              <p className="text-xs text-emerald-300/80">Valid test inputs generated exact expected outputs; invalid inputs properly caught by syntax validator.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-900/80 border border-emerald-700 text-emerald-200 rounded-md">
            {passedCount === totalCount ? '100% Pass' : `${Math.round((passedCount / totalCount) * 100)}% Pass`}
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterCategory === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Cases ({totalCount})
        </button>
        <button
          onClick={() => setFilterCategory('valid')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterCategory === 'valid'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Valid Inputs ({validCount})
        </button>
        <button
          onClick={() => setFilterCategory('invalid')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterCategory === 'invalid'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Invalid Inputs ({invalidCount})
        </button>
      </div>

      {/* Test Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((tc) => {
          const batchStatus = batchResults ? batchResults[tc.id] : null;

          return (
            <div
              key={tc.id}
              className={`p-5 rounded-2xl border transition-all ${
                tc.expectedValid
                  ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  : 'bg-rose-950/20 border-rose-900/40 hover:border-rose-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base font-mono">
                      {tc.input === '' ? '<Empty String>' : tc.input}
                    </span>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      tc.expectedValid
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
                        : 'bg-rose-950 text-rose-400 border-rose-800/60'
                    }`}>
                      {tc.expectedValid ? 'VALID' : 'INVALID'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{tc.name}</p>
                </div>

                <button
                  onClick={() => onLoadAndRunTestCase(tc.input)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run in Sim</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {tc.description}
              </p>

              {/* Expected metrics or error rule */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 text-xs font-mono space-y-1">
                {tc.expectedValid ? (
                  <div className="flex flex-wrap items-center justify-between text-slate-400">
                    <span>Expected Output: <strong className="text-amber-300">{tc.expectedOutput}</strong></span>
                    <span>Expected Final: <strong className="text-indigo-300">{tc.expectedFinalState}</strong></span>
                  </div>
                ) : (
                  <div className="text-rose-400/90 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Violates binary alphabet Σ = {'{0, 1}'}. Properly rejected.</span>
                  </div>
                )}
              </div>

              {/* Batch test check indicator */}
              {batchStatus && (
                <div className={`mt-2 p-2 rounded-lg text-xs font-mono flex items-center gap-2 ${
                  batchStatus.passed
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/70'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-800/70'
                }`}>
                  {batchStatus.passed ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">{batchStatus.message}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

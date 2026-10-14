import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-400">Moore Machine Simulator</span>
          <span className="mx-2">·</span>
          <span>Theory of Computation Academic Laboratory Project</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Self-Contained Client Engine</span>
          <span>·</span>
          <span>Strict State-Output Mapping (λ: Q → Δ)</span>
        </div>
      </div>
    </footer>
  );
};

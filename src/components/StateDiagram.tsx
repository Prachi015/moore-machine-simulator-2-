import React from 'react';
import { StateId } from '../types/moore';
import { MACHINE_STATES } from '../utils/mooreMachine';

interface StateDiagramProps {
  currentState?: StateId | null;
  activeTransitionKey?: string | null;
  onSelectState?: (state: StateId) => void;
  interactive?: boolean;
}

export const StateDiagram: React.FC<StateDiagramProps> = ({
  currentState = 'q0',
  activeTransitionKey = null,
  onSelectState,
  interactive = true,
}) => {
  // Node coordinates in SVG viewport 580 x 480
  const nodes = {
    q0: { x: 130, y: 240, r: 42, label: 'q0', output: '0', isInitial: true },
    q1: { x: 430, y: 130, r: 42, label: 'q1', output: '1', isInitial: false },
    q2: { x: 430, y: 360, r: 42, label: 'q2', output: '0', isInitial: false },
  };

  const isTransitionActive = (key: string) => activeTransitionKey === key;

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      <div className="w-full aspect-[580/480] bg-slate-900/80 rounded-2xl border border-slate-800/90 shadow-2xl p-2 relative overflow-hidden backdrop-blur-sm">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Legend */}
        <div className="absolute top-3 left-4 text-xs font-mono text-slate-400 z-10 flex items-center gap-3 pointer-events-none bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
            Active State
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Format: State / Output</span>
        </div>

        <svg
          viewBox="0 0 580 480"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Standard arrowhead marker */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#64748b" />
            </marker>

            {/* Active arrow marker */}
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============================================================ */}
          {/* TRANSITIONS & PATHS */}
          {/* ============================================================ */}

          {/* 1. Start Pointer into q0 */}
          <g className="transition-all duration-300">
            <line
              x1="35"
              y1="240"
              x2="85"
              y2="240"
              stroke="#818cf8"
              strokeWidth="2.5"
              markerEnd="url(#arrow-default)"
            />
            <text
              x="55"
              y="230"
              fill="#c7d2fe"
              fontSize="12"
              fontWeight="600"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              Start
            </text>
          </g>

          {/* 2. Self-loop: q0 --0--> q0 */}
          {/* Left loop arching back into q0 */}
          <g>
            <path
              d="M 100 215 C 30 160 30 320 100 265"
              fill="none"
              stroke={isTransitionActive('q0-0->q0') ? '#38bdf8' : '#475569'}
              strokeWidth={isTransitionActive('q0-0->q0') ? '3.5' : '2'}
              strokeDasharray={isTransitionActive('q0-0->q0') ? '6 3' : 'none'}
              markerEnd={isTransitionActive('q0-0->q0') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
              className="transition-colors duration-300"
              filter={isTransitionActive('q0-0->q0') ? 'url(#glow)' : undefined}
            />
            {/* Label container */}
            <rect x="25" y="228" width="22" height="22" rx="4" fill="#0f172a" stroke={isTransitionActive('q0-0->q0') ? '#38bdf8' : '#334155'} strokeWidth="1" />
            <text
              x="36"
              y="244"
              fill={isTransitionActive('q0-0->q0') ? '#38bdf8' : '#cbd5e1'}
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              0
            </text>
          </g>

          {/* 3. Transition: q0 --1--> q1 */}
          <g>
            <path
              d="M 165 215 C 240 165 315 135 388 135"
              fill="none"
              stroke={isTransitionActive('q0-1->q1') ? '#38bdf8' : '#475569'}
              strokeWidth={isTransitionActive('q0-1->q1') ? '3.5' : '2'}
              strokeDasharray={isTransitionActive('q0-1->q1') ? '6 3' : 'none'}
              markerEnd={isTransitionActive('q0-1->q1') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
              className="transition-colors duration-300"
              filter={isTransitionActive('q0-1->q1') ? 'url(#glow)' : undefined}
            />
            <rect x="260" y="150" width="22" height="22" rx="4" fill="#0f172a" stroke={isTransitionActive('q0-1->q1') ? '#38bdf8' : '#334155'} strokeWidth="1" />
            <text
              x="271"
              y="166"
              fill={isTransitionActive('q0-1->q1') ? '#38bdf8' : '#cbd5e1'}
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              1
            </text>
          </g>

          {/* 4. Self-loop: q1 --1--> q1 */}
          <g>
            <path
              d="M 445 92 C 485 30 540 85 465 110"
              fill="none"
              stroke={isTransitionActive('q1-1->q1') ? '#38bdf8' : '#475569'}
              strokeWidth={isTransitionActive('q1-1->q1') ? '3.5' : '2'}
              strokeDasharray={isTransitionActive('q1-1->q1') ? '6 3' : 'none'}
              markerEnd={isTransitionActive('q1-1->q1') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
              className="transition-colors duration-300"
              filter={isTransitionActive('q1-1->q1') ? 'url(#glow)' : undefined}
            />
            <rect x="495" y="50" width="22" height="22" rx="4" fill="#0f172a" stroke={isTransitionActive('q1-1->q1') ? '#38bdf8' : '#334155'} strokeWidth="1" />
            <text
              x="506"
              y="66"
              fill={isTransitionActive('q1-1->q1') ? '#38bdf8' : '#cbd5e1'}
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              1
            </text>
          </g>

          {/* 5. Transition: q1 --0--> q2 */}
          {/* Curve bowing toward center-left */}
          <g>
            <path
              d="M 415 170 C 385 220 385 270 415 320"
              fill="none"
              stroke={isTransitionActive('q1-0->q2') ? '#38bdf8' : '#475569'}
              strokeWidth={isTransitionActive('q1-0->q2') ? '3.5' : '2'}
              strokeDasharray={isTransitionActive('q1-0->q2') ? '6 3' : 'none'}
              markerEnd={isTransitionActive('q1-0->q2') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
              className="transition-colors duration-300"
              filter={isTransitionActive('q1-0->q2') ? 'url(#glow)' : undefined}
            />
            <rect x="370" y="234" width="22" height="22" rx="4" fill="#0f172a" stroke={isTransitionActive('q1-0->q2') ? '#38bdf8' : '#334155'} strokeWidth="1" />
            <text
              x="381"
              y="250"
              fill={isTransitionActive('q1-0->q2') ? '#38bdf8' : '#cbd5e1'}
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              0
            </text>
          </g>

          {/* 6. Transition: q2 --1--> q1 */}
          {/* Curve bowing toward outer-right */}
          <g>
            <path
              d="M 445 320 C 475 270 475 220 445 170"
              fill="none"
              stroke={isTransitionActive('q2-1->q1') ? '#38bdf8' : '#475569'}
              strokeWidth={isTransitionActive('q2-1->q1') ? '3.5' : '2'}
              strokeDasharray={isTransitionActive('q2-1->q1') ? '6 3' : 'none'}
              markerEnd={isTransitionActive('q2-1->q1') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
              className="transition-colors duration-300"
              filter={isTransitionActive('q2-1->q1') ? 'url(#glow)' : undefined}
            />
            <rect x="465" y="234" width="22" height="22" rx="4" fill="#0f172a" stroke={isTransitionActive('q2-1->q1') ? '#38bdf8' : '#334155'} strokeWidth="1" />
            <text
              x="476"
              y="250"
              fill={isTransitionActive('q2-1->q1') ? '#38bdf8' : '#cbd5e1'}
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              1
            </text>
          </g>

          {/* 7. Transition: q2 --0--> q0 */}
          {/* Curve bowing downward back to q0 */}
          <g>
            <path
              d="M 390 375 C 290 415 200 370 155 280"
              fill="none"
              stroke={isTransitionActive('q2-0->q0') ? '#38bdf8' : '#475569'}
              strokeWidth={isTransitionActive('q2-0->q0') ? '3.5' : '2'}
              strokeDasharray={isTransitionActive('q2-0->q0') ? '6 3' : 'none'}
              markerEnd={isTransitionActive('q2-0->q0') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
              className="transition-colors duration-300"
              filter={isTransitionActive('q2-0->q0') ? 'url(#glow)' : undefined}
            />
            <rect x="250" y="380" width="22" height="22" rx="4" fill="#0f172a" stroke={isTransitionActive('q2-0->q0') ? '#38bdf8' : '#334155'} strokeWidth="1" />
            <text
              x="261"
              y="396"
              fill={isTransitionActive('q2-0->q0') ? '#38bdf8' : '#cbd5e1'}
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              0
            </text>
          </g>

          {/* ============================================================ */}
          {/* STATE NODES (q0, q1, q2) */}
          {/* ============================================================ */}
          {(Object.keys(nodes) as StateId[]).map((stateKey) => {
            const node = nodes[stateKey];
            const isActive = currentState === stateKey;
            const def = MACHINE_STATES[stateKey];

            return (
              <g
                key={stateKey}
                className={`transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
                onClick={() => interactive && onSelectState && onSelectState(stateKey)}
              >
                {/* Active Outer Pulsing Ring */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r + 9}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '6s' }}
                  />
                )}

                {/* State Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={isActive ? '#1e1b4b' : '#0f172a'}
                  stroke={isActive ? '#818cf8' : '#334155'}
                  strokeWidth={isActive ? '3' : '2'}
                  filter={isActive ? 'url(#glow)' : undefined}
                  className="transition-all duration-300 hover:stroke-indigo-400"
                />

                {/* Moore State Divider Line: separates State name and Output symbol */}
                <line
                  x1={node.x - node.r + 6}
                  y1={node.y}
                  x2={node.x + node.r - 6}
                  y2={node.y}
                  stroke={isActive ? '#818cf8' : '#334155'}
                  strokeWidth="1.5"
                />

                {/* State Identifier (Upper Half) */}
                <text
                  x={node.x}
                  y={node.y - 10}
                  fill={isActive ? '#ffffff' : '#e2e8f0'}
                  fontSize="18"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  {node.label}
                </text>

                {/* State Output (Lower Half) - Strict Moore Concept */}
                <text
                  x={node.x}
                  y={node.y + 22}
                  fill={isActive ? '#a5b4fc' : '#94a3b8'}
                  fontSize="16"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                >
                  {def.output}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* State details footer */}
      <div className="w-full mt-3 grid grid-cols-3 gap-2">
        {(Object.keys(MACHINE_STATES) as StateId[]).map((stateKey) => {
          const s = MACHINE_STATES[stateKey];
          const isActive = currentState === stateKey;
          return (
            <div
              key={stateKey}
              onClick={() => interactive && onSelectState && onSelectState(stateKey)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                interactive ? 'cursor-pointer' : ''
              } ${
                isActive
                  ? 'bg-indigo-950/60 border-indigo-500/70 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-100">{s.name}</span>
                <span className="text-xs text-slate-400">output:</span>
                <span className={`font-mono font-bold text-sm px-1.5 py-0.2 rounded ${
                  s.output === '1' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {s.output}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {s.isInitial ? 'Initial State' : stateKey === 'q1' ? 'Active State' : 'Alternate State'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

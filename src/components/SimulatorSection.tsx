import React, { useState, useEffect, useRef } from 'react';
import { StateId, SimulationResult, SimulationStep } from '../types/moore';
import { simulateMooreMachine, validateBinaryInput, sound } from '../utils/mooreMachine';
import { StateDiagram } from './StateDiagram';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, FastForward, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';

interface SimulatorSectionProps {
  currentInput: string;
  onInputChange: (val: string) => void;
  simulationResult: SimulationResult | null;
  onSimulationComplete: (result: SimulationResult) => void;
  onNavigateToResults: () => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  currentInput,
  onInputChange,
  simulationResult,
  onSimulationComplete,
  onNavigateToResults,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeedMs, setPlaybackSpeedMs] = useState<number>(800); // 800ms per step
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTapeRef = useRef<HTMLDivElement | null>(null);

  // Derive active step
  const activeStep: SimulationStep | null =
    simulationResult && simulationResult.steps[currentStepIndex]
      ? simulationResult.steps[currentStepIndex]
      : null;

  // Active State:
  // Step 0: Initial start state 'q0' before reading any input symbols.
  // Step k (k >= 1): Destination state reached after processing symbol k.
  // In a Moore Machine, the machine enters this state and emits its output.
  const currentActiveState: StateId =
    simulationResult && simulationResult.stateSequence[currentStepIndex] !== undefined
      ? simulationResult.stateSequence[currentStepIndex]
      : 'q0';

  const activeTransitionKey: string | null = activeStep?.activeTransitionKey || null;

  // Auto-scroll tape reader head as animation progresses
  useEffect(() => {
    if (activeTapeRef.current) {
      activeTapeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentStepIndex]);

  const displayError = validationError || (simulationResult && !simulationResult.isValid ? simulationResult.errorMessage : null);

  // Handle Input Changes with real-time validation preview
  const handleInputChange = (val: string) => {
    onInputChange(val);
    setValidationError(null);
  };

  // Run Simulation Initiation
  const handleStartSimulate = () => {
    const validation = validateBinaryInput(currentInput);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Invalid binary input.');
      sound.playError();
      return;
    }

    setValidationError(null);
    const result = simulateMooreMachine(currentInput);
    onSimulationComplete(result);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    sound.playStep('-');
  };

  const handleClear = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    onInputChange('');
    setValidationError(null);
    setCurrentStepIndex(0);
  };

  // Playback timer effect
  useEffect(() => {
    if (isPlaying && simulationResult && simulationResult.isValid) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex + 1 < simulationResult.steps.length) {
            const nextIdx = prevIndex + 1;
            const nextStep = simulationResult.steps[nextIdx];
            sound.playStep(nextStep.inputSymbol);
            return nextIdx;
          } else {
            // Reached completion
            setIsPlaying(false);
            sound.playComplete();
            return prevIndex;
          }
        });
      }, playbackSpeedMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, simulationResult, playbackSpeedMs]);

  // Stepper controls
  const handleStepForward = () => {
    if (!simulationResult || !simulationResult.isValid) return;
    setIsPlaying(false);
    if (currentStepIndex + 1 < simulationResult.steps.length) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      sound.playStep(simulationResult.steps[nextIdx].inputSymbol);
    }
  };

  const handleStepBackward = () => {
    if (!simulationResult || !simulationResult.isValid) return;
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      sound.playTone(350, 0.05);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    sound.playTone(300, 0.05);
  };

  // Skip animation and jump directly to full result
  const handleSkipToFullResult = () => {
    if (!simulationResult || !simulationResult.isValid) return;
    setIsPlaying(false);
    const lastStep = simulationResult.steps.length - 1;
    setCurrentStepIndex(lastStep);
    sound.playComplete();
  };

  const totalSteps = simulationResult ? simulationResult.steps.length - 1 : 0;
  const isAtEnd = Boolean(simulationResult && currentStepIndex === simulationResult.steps.length - 1);
  const progressPercent = simulationResult && totalSteps > 0
    ? Math.round((currentStepIndex / totalSteps) * 100)
    : 0;

  // Accumulated sequences up to current step
  const accumulatedStates = simulationResult
    ? simulationResult.stateSequence.slice(0, currentStepIndex + 1)
    : ['q0'];
  const accumulatedOutput = simulationResult
    ? simulationResult.outputSequence.slice(0, currentStepIndex + 1)
    : '0';

  const handleCopyCurrentOutput = () => {
    navigator.clipboard.writeText(accumulatedOutput);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  // Optimization for arbitrary length inputs: Windowed tape view to prevent excessive DOM elements
  const TAPE_WINDOW_SIZE = 36;
  const totalInputLength = simulationResult ? simulationResult.inputLength : 0;
  const isTapeWindowed = totalInputLength > TAPE_WINDOW_SIZE;

  let tapeWindowStart = 0;
  let tapeWindowEnd = totalInputLength;

  if (isTapeWindowed && simulationResult) {
    const headIndex = Math.max(0, currentStepIndex - 1);
    const halfWindow = Math.floor(TAPE_WINDOW_SIZE / 2);
    tapeWindowStart = Math.max(0, headIndex - halfWindow);
    tapeWindowEnd = Math.min(totalInputLength, tapeWindowStart + TAPE_WINDOW_SIZE);
    if (tapeWindowEnd - tapeWindowStart < TAPE_WINDOW_SIZE) {
      tapeWindowStart = Math.max(0, tapeWindowEnd - TAPE_WINDOW_SIZE);
    }
  }

  const visibleTapeSymbols = simulationResult && isTapeWindowed
    ? simulationResult.inputString.slice(tapeWindowStart, tapeWindowEnd).split('')
    : simulationResult
    ? simulationResult.inputString.split('')
    : [];

  return (
    <div className="space-y-8 py-4">
      {/* Title */}
      <div>
        <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
          Section 3 · Execution Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Interactive Moore Machine Simulator
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Supply a binary string of arbitrary length to execute state transitions step-by-step. For any input of length <code className="text-slate-200 font-mono font-bold">N</code>, the machine executes exactly <code className="text-purple-300 font-mono font-bold">N</code> transitions and produces <code className="text-amber-300 font-mono font-bold">N + 1</code> state outputs (including initial state <code className="text-amber-300 font-mono">q0</code> output).
        </p>
      </div>

      {/* Input Control Deck */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="binary-input" className="block text-sm font-semibold text-white">
              Enter Binary Input (Alphabet Σ = {'{0, 1}'}):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                Input Length: <strong className="text-cyan-400 font-bold">{currentInput.length}</strong> symbols
              </span>
              {currentInput && !validationError && (
                <span className="text-xs font-mono px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300 hidden sm:inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Expected Outputs: {currentInput.length + 1}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <textarea
                id="binary-input"
                rows={2}
                value={currentInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter binary sequence of any length (e.g. 10110, 101010101010, 00000000000000000000, 11111111111111111111)"
                className={`w-full px-4 py-3 bg-slate-950 font-mono text-sm sm:text-base tracking-widest rounded-xl border text-white placeholder-slate-600 focus:outline-none transition-colors resize-y min-h-[52px] ${
                  displayError
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
            </div>

            <div className="flex flex-row sm:flex-col justify-end gap-2 shrink-0">
              <button
                onClick={handleStartSimulate}
                className="flex-1 sm:flex-initial px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>SIMULATE</span>
              </button>

              <button
                onClick={handleClear}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700 transition-colors whitespace-nowrap"
              >
                CLEAR
              </button>
            </div>
          </div>

          {/* Validation Error Banner */}
          {displayError && (
            <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl flex items-start gap-3 text-rose-200 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Validation Error</p>
                <p className="text-rose-200/90 mt-0.5">{displayError}</p>
                <p className="text-[11px] text-rose-300/70 mt-1">Hint: Binary symbols must belong strictly to alphabet {'{0, 1}'}. Spaces and non-binary characters are forbidden.</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick presets for arbitrary lengths */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
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
              onClick={() => {
                handleInputChange(preset.val);
                const res = simulateMooreMachine(preset.val);
                onSimulationComplete(res);
                setCurrentStepIndex(0);
                setIsPlaying(true);
              }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md border border-slate-700/60 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Viewport (Diagram + Playback Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Diagram Synchronized */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Synchronized State Topology</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Active State: <strong className="text-indigo-400 font-bold">{currentActiveState}</strong>
            </span>
          </div>

          <StateDiagram
            currentState={currentActiveState}
            activeTransitionKey={activeTransitionKey}
            interactive={false}
          />

          {/* Current Step Explanation Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
              <span>Step-by-Step Transition Log</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Machine State:</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700/80 font-mono font-bold text-xs text-indigo-300">
                  {currentActiveState}
                </span>
                <span className="font-mono text-indigo-400 ml-1">Step {currentStepIndex} / {totalSteps}</span>
              </div>
            </div>
            <p className="text-sm text-slate-200 font-mono leading-relaxed">
              {activeStep ? activeStep.description : 'Press SIMULATE to initiate the interpreter execution.'}
            </p>
          </div>
        </div>

        {/* Right: Tape Visualizer & Stepper Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Virtual Input Tape Visualizer */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Input Tape & Scanning Head</h3>
                <p className="text-xs text-slate-400">Auto-scrolls to follow scanning head across arbitrary string lengths</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {simulationResult ? `${simulationResult.inputLength} symbols` : '0 symbols'}
              </span>
            </div>

            {/* Tape cells container with smooth scrolling and windowed sliding view for arbitrary lengths */}
            <div className="space-y-2">
              {isTapeWindowed && (
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                  <span>
                    Window: symbols <strong className="text-slate-200">[{tapeWindowStart} .. {tapeWindowEnd - 1}]</strong> of {totalInputLength}
                  </span>
                  <span>
                    Head at Step <strong className="text-cyan-400">{currentStepIndex}</strong> ({currentStepIndex === 0 ? 'Start' : `symbol [${currentStepIndex - 1}]`})
                  </span>
                </div>
              )}

              <div className="overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-slate-700">
                {simulationResult && simulationResult.inputString.length > 0 ? (
                  <div className="flex items-center justify-start gap-2 min-w-max px-1">
                    {/* Step 0 condition (Before reading symbol) */}
                    {tapeWindowStart === 0 && (
                      <div
                        ref={currentStepIndex === 0 ? activeTapeRef : undefined}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStepIndex(0);
                          sound.playStep('-');
                        }}
                        className={`p-2.5 rounded-lg border font-mono text-center min-w-[54px] cursor-pointer transition-all ${
                          currentStepIndex === 0
                            ? 'bg-indigo-950 border-indigo-400 shadow-md ring-2 ring-indigo-500/60 scale-105'
                            : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        title="Step 0: Initial condition at state q0"
                      >
                        <div className="text-[10px] text-slate-400">Start</div>
                        <div className="text-base font-bold text-slate-200">-</div>
                      </div>
                    )}

                    {/* Preceding symbols jump button */}
                    {tapeWindowStart > 0 && (
                      <button
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStepIndex(0);
                          sound.playStep('-');
                        }}
                        className="p-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-white px-2.5 flex flex-col items-center justify-center transition-colors shrink-0"
                        title="Click to jump to Step 0 (Start)"
                      >
                        <span className="text-indigo-400 font-bold">◀ [0]</span>
                        <span>({tapeWindowStart} prior)</span>
                      </button>
                    )}

                    {/* Windowed tape cells */}
                    {visibleTapeSymbols.map((char, localIdx) => {
                      const idx = tapeWindowStart + localIdx;
                      const stepNum = idx + 1;
                      const isCurrentSymbol = currentStepIndex === stepNum;
                      const isProcessed = currentStepIndex > stepNum;

                      return (
                        <div
                          key={idx}
                          ref={isCurrentSymbol ? activeTapeRef : undefined}
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex(stepNum);
                            sound.playStep(char);
                          }}
                          className={`p-2.5 rounded-lg border font-mono text-center min-w-[54px] cursor-pointer transition-all ${
                            isCurrentSymbol
                              ? 'bg-cyan-950 border-cyan-400 shadow-lg ring-2 ring-cyan-500/80 scale-105'
                              : isProcessed
                              ? 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                              : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:border-slate-700'
                          }`}
                          title={`Click to jump to Step ${stepNum} (scanned '${char}')`}
                        >
                          <div className="text-[10px] text-slate-400">[{idx}]</div>
                          <div className={`text-base font-bold ${isCurrentSymbol ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {char}
                          </div>
                        </div>
                      );
                    })}

                    {/* Remaining symbols jump button */}
                    {tapeWindowEnd < totalInputLength && (
                      <button
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStepIndex(totalInputLength);
                          sound.playComplete();
                        }}
                        className="p-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-white px-2.5 flex flex-col items-center justify-center transition-colors shrink-0"
                        title={`Click to jump to Step ${totalInputLength} (End)`}
                      >
                        <span className="text-cyan-400 font-bold">[{totalInputLength - 1}] ▶</span>
                        <span>({totalInputLength - tapeWindowEnd} more)</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 font-mono">
                    Input tape is empty. Enter a binary string above to visualize tape reader head.
                  </div>
                )}
              </div>
            </div>

            {/* Output Sequence Stream with auto-wrap and copy */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Accumulated Output Sequence</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-300">Length: {accumulatedOutput.length}</span>
                  <button
                    onClick={handleCopyCurrentOutput}
                    className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                    title="Copy current output stream"
                  >
                    {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {accumulatedOutput.length <= 120 ? (
                <div className="font-mono text-lg tracking-widest text-amber-300 font-bold break-all max-h-36 overflow-y-auto p-1 leading-relaxed">
                  {accumulatedOutput.split('').map((ch, i) => (
                    <span
                      key={i}
                      className={`inline-block px-1 py-0.5 m-0.5 rounded text-sm ${
                        i === 0
                          ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/60'
                          : i === currentStepIndex
                          ? 'bg-amber-500/30 text-amber-200 border border-amber-500 animate-pulse'
                          : 'bg-slate-900 text-slate-200'
                      }`}
                      title={i === 0 ? 'Initial State q0 output (λ(q0))' : `Output from step ${i}`}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-base tracking-widest text-amber-300 font-bold break-all max-h-36 overflow-y-auto p-2 bg-slate-900/70 rounded-lg border border-slate-800 leading-relaxed select-all">
                  {accumulatedOutput}
                </div>
              )}
              <div className="text-[11px] text-slate-400">
                Initial output <code className="text-indigo-300">0</code> emitted by state q0 before input consumption. Complete output length = input length + 1.
              </div>
            </div>

            {/* State Sequence Stream with scrollable wrapper */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Visited State Sequence</span>
                <span className="font-mono text-slate-400 text-[11px]">State Sequence Entries: {accumulatedStates.length}</span>
              </div>
              {accumulatedStates.length <= 80 ? (
                <div className="font-mono text-xs text-slate-300 flex flex-wrap items-center gap-1 max-h-32 overflow-y-auto p-1">
                  {accumulatedStates.map((st, i) => (
                    <React.Fragment key={i}>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        i === currentStepIndex ? 'bg-indigo-600 text-white ring-1 ring-indigo-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {st}
                      </span>
                      {i < accumulatedStates.length - 1 && (
                        <span className="text-slate-600">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-xs text-slate-300 break-all max-h-32 overflow-y-auto p-2 bg-slate-900/70 rounded-lg border border-slate-800 leading-relaxed">
                  {accumulatedStates.join(' → ')}
                </div>
              )}
            </div>
          </div>

          {/* Stepper & Playback Controls Deck */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
            {/* Progress bar and numeric indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="font-semibold">
                  Progress: Step {currentStepIndex} / {totalSteps}
                </span>
                <span className="text-indigo-400 font-bold">{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Step Scrubber for long inputs */}
            {simulationResult && totalSteps > 0 && (
              <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Scrub Head:</span>
                <input
                  type="range"
                  min={0}
                  max={totalSteps}
                  value={currentStepIndex}
                  onChange={(e) => {
                    setIsPlaying(false);
                    const idx = Number(e.target.value);
                    setCurrentStepIndex(idx);
                    if (idx === 0) {
                      sound.playStep('-');
                    } else if (idx === totalSteps) {
                      sound.playComplete();
                    } else {
                      sound.playStep(simulationResult.steps[idx]?.inputSymbol || '0');
                    }
                  }}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  title="Scrub scanning head to any step instantly"
                />
                <span className="text-xs font-mono text-indigo-400 shrink-0 min-w-[50px] text-right">
                  {currentStepIndex}/{totalSteps}
                </span>
              </div>
            )}

            {/* Control buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleStepBackward}
                  disabled={!simulationResult || currentStepIndex === 0}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition-colors"
                  title="Previous Step"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (isAtEnd) {
                      setCurrentStepIndex(0);
                      setIsPlaying(true);
                      sound.playStep('-');
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  disabled={!simulationResult || !simulationResult.isValid}
                  className={`px-5 py-2.5 font-bold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                      : isAtEnd
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 disabled:opacity-40'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>PAUSE</span>
                    </>
                  ) : isAtEnd ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>REPLAY</span>
                    </>
                  ) : currentStepIndex > 0 ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>RESUME</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>PLAY</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={!simulationResult || isAtEnd}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition-colors"
                  title="Next Step"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  disabled={!simulationResult}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                  title="Reset to Step 0 (Initial Condition)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Instant Result / Skip Animation Button */}
                <button
                  onClick={handleSkipToFullResult}
                  disabled={!simulationResult || isAtEnd}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 hover:text-cyan-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                  title="Skip animation and display full computed result immediately"
                >
                  <FastForward className="w-4 h-4" />
                  <span>Instant Result / Skip</span>
                </button>
              </div>

              {/* Speed Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Speed:</span>
                {[
                  { label: '0.5x', ms: 1400 },
                  { label: '1x', ms: 800 },
                  { label: '2x', ms: 400 },
                  { label: '5x', ms: 150 },
                ].map((spd) => (
                  <button
                    key={spd.label}
                    onClick={() => setPlaybackSpeedMs(spd.ms)}
                    className={`px-2 py-1 rounded font-mono text-xs transition-colors ${
                      playbackSpeedMs === spd.ms
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation Finished notification with jump to results */}
            {isAtEnd && simulationResult && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-200 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span>Simulation completed for {simulationResult.inputLength} symbols!</span>
                    <span className="block text-xs text-emerald-300/80">Final state: <strong>{simulationResult.finalState}</strong> · Output length: <strong>{simulationResult.outputSequence.length}</strong></span>
                  </div>
                </div>
                <button
                  onClick={onNavigateToResults}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap self-end sm:self-auto"
                >
                  View Full Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


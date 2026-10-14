import { StateId, BinarySymbol, StateDefinition, TransitionRule, SimulationStep, SimulationResult, TestCase } from '../types/moore';

/**
 * State Definitions
 * Moore Machine states with outputs tied strictly to each state.
 */
export const MACHINE_STATES: Record<StateId, StateDefinition> = {
  q0: {
    id: 'q0',
    name: 'q0',
    output: '0',
    description: 'Initial state; outputs 0. Remains on 0, advances to q1 on 1.',
    isInitial: true,
  },
  q1: {
    id: 'q1',
    name: 'q1',
    output: '1',
    description: 'Active state; outputs 1. Transitions to q2 on 0, loops to q1 on 1.',
    isInitial: false,
  },
  q2: {
    id: 'q2',
    name: 'q2',
    output: '0',
    description: 'Alternate state; outputs 0. Resets to q0 on 0, returns to q1 on 1.',
    isInitial: false,
  },
};

export const INITIAL_STATE: StateId = 'q0';

/**
 * State Transition Function δ: Q × Σ → Q
 */
export const TRANSITIONS: TransitionRule[] = [
  { fromState: 'q0', input: '0', toState: 'q0' },
  { fromState: 'q0', input: '1', toState: 'q1' },
  { fromState: 'q1', input: '0', toState: 'q2' },
  { fromState: 'q1', input: '1', toState: 'q1' },
  { fromState: 'q2', input: '0', toState: 'q0' },
  { fromState: 'q2', input: '1', toState: 'q1' },
];

/**
 * Transition Lookup map: (state, input) => nextState
 */
export function getNextState(current: StateId, input: BinarySymbol): StateId {
  const rule = TRANSITIONS.find((t) => t.fromState === current && t.input === input);
  if (!rule) {
    throw new Error(`Invalid transition: no rule for state ${current} on input ${input}`);
  }
  return rule.toState;
}

/**
 * Output Function λ: Q → Δ
 * In a Moore machine, output depends strictly on the current state.
 */
export function getStateOutput(state: StateId): BinarySymbol {
  return MACHINE_STATES[state].output;
}

/**
 * Validate binary input string
 */
export function validateBinaryInput(input: string): {
  isValid: boolean;
  cleanedInput: string;
  errorMessage?: string;
  invalidIndices?: number[];
} {
  if (!input || input.length === 0) {
    return {
      isValid: false,
      cleanedInput: '',
      errorMessage: 'Input string cannot be empty. Please enter a valid binary sequence of 0s and 1s.',
    };
  }

  // Check for any spaces or illegal characters
  const invalidIndices: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch !== '0' && ch !== '1') {
      invalidIndices.push(i);
    }
  }

  if (invalidIndices.length > 0) {
    const invalidChars = Array.from(
      new Set(
        invalidIndices.map((i) => (input[i] === ' ' ? '<space>' : `'${input[i]}'`))
      )
    ).join(', ');

    return {
      isValid: false,
      cleanedInput: input,
      invalidIndices,
      errorMessage: `Invalid binary input. Only binary symbols 0 and 1 are allowed. Detected illegal character(s): ${invalidChars} at index ${invalidIndices.join(', ')}.`,
    };
  }

  return {
    isValid: true,
    cleanedInput: input,
  };
}

/**
 * Run deterministic Moore Machine simulation
 * Convention: Output includes the initial state q0 before reading the first symbol.
 * For an input of n symbols, n+1 outputs are produced.
 */
export function simulateMooreMachine(input: string): SimulationResult {
  const validation = validateBinaryInput(input);
  if (!validation.isValid) {
    return {
      inputString: input,
      isValid: false,
      errorMessage: validation.errorMessage,
      initialState: INITIAL_STATE,
      initialStateOutput: getStateOutput(INITIAL_STATE),
      stateSequence: [],
      stateSequenceLength: 0,
      symbolProcessedOutputSequence: '',
      outputSequence: '',
      outputSequenceLength: 0,
      finalState: INITIAL_STATE,
      inputLength: input.length,
      transitionsCount: 0,
      statesVisitedCount: 0,
      uniqueStatesUsed: [],
      uniqueStatesCount: 0,
      steps: [],
      timestamp: Date.now(),
    };
  }

  const clean = validation.cleanedInput;
  const steps: SimulationStep[] = [];
  const stateSequence: StateId[] = [INITIAL_STATE];
  const initialOutput = getStateOutput(INITIAL_STATE);
  let outputSequence = initialOutput; // Complete Moore output sequence: starts with λ(q0)
  let symbolProcessedOutputSequence = ''; // Output emitted strictly after reading each input symbol

  // Step 0: Initial state output prior to any input consumption
  steps.push({
    step: 0,
    inputSymbol: '-',
    currentState: INITIAL_STATE,
    nextState: '-',
    outputSymbol: initialOutput,
    description: `Initial condition: Machine initialized in start state ${INITIAL_STATE}. Emits initial state output λ(${INITIAL_STATE}) = '${initialOutput}' before processing any input symbols.`,
  });

  let currentState: StateId = INITIAL_STATE;

  for (let i = 0; i < clean.length; i++) {
    const symbol = clean[i] as BinarySymbol;
    const nextState = getNextState(currentState, symbol);
    const output = getStateOutput(nextState);

    stateSequence.push(nextState);
    symbolProcessedOutputSequence += output;
    outputSequence += output;

    steps.push({
      step: i + 1,
      inputSymbol: symbol,
      currentState: currentState,
      nextState: nextState,
      outputSymbol: output,
      description: `Step ${i + 1}: Scanned symbol '${symbol}'. Transition δ(${currentState}, '${symbol}') ➔ ${nextState}. Emits state output λ(${nextState}) = '${output}'.`,
      activeTransitionKey: `${currentState}-${symbol}->${nextState}`,
    });

    currentState = nextState;
  }

  // Unique states visited (subset of {q0, q1, q2}, maximum 3)
  const uniqueStates = Array.from(new Set(stateSequence));

  return {
    inputString: clean,
    isValid: true,
    initialState: INITIAL_STATE,
    initialStateOutput: initialOutput,
    stateSequence,
    stateSequenceLength: stateSequence.length, // N + 1
    symbolProcessedOutputSequence, // Length N
    outputSequence, // Length N + 1
    outputSequenceLength: outputSequence.length,
    finalState: currentState,
    inputLength: clean.length,
    transitionsCount: clean.length, // N transitions
    statesVisitedCount: stateSequence.length, // N + 1 states in sequence
    uniqueStatesUsed: uniqueStates,
    uniqueStatesCount: uniqueStates.length,
    steps,
    timestamp: Date.now(),
  };
}

/**
 * Predefined Test Cases
 */
export const PREDEFINED_TEST_CASES: TestCase[] = [
  {
    id: 'tc-1',
    name: '10110 (Default Project Case - Length 5)',
    input: '10110',
    expectedValid: true,
    expectedOutput: '010110',
    expectedFinalState: 'q2',
    description: 'Official project example demonstrating alternating state visits and loop cycles.',
    category: 'standard',
  },
  {
    id: 'tc-zero-single',
    name: '0 (Single Zero - Length 1)',
    input: '0',
    expectedValid: true,
    expectedOutput: '00',
    expectedFinalState: 'q0',
    description: 'Single zero: q0 on 0 loops to q0. Output: λ(q0)=0 initially, λ(q0)=0 after step 1 -> "00".',
    category: 'standard',
  },
  {
    id: 'tc-single',
    name: '1 (Single One - Length 1)',
    input: '1',
    expectedValid: true,
    expectedOutput: '01',
    expectedFinalState: 'q1',
    description: 'Single one: q0 on 1 transitions to q1. Produces initial 0 + state output 1 -> "01".',
    category: 'standard',
  },
  {
    id: 'tc-two',
    name: '10 (Two Symbols - Length 2)',
    input: '10',
    expectedValid: true,
    expectedOutput: '010',
    expectedFinalState: 'q2',
    description: 'Two-symbol sequence: q0 -> q1 -> q2. Produces 3 outputs (010).',
    category: 'standard',
  },
  {
    id: 'tc-three',
    name: '101 (Three Symbols - Length 3)',
    input: '101',
    expectedValid: true,
    expectedOutput: '0101',
    expectedFinalState: 'q1',
    description: 'Three-symbol sequence: q0 -> q1 -> q2 -> q1. Produces 4 outputs (0101).',
    category: 'standard',
  },
  {
    id: 'tc-zeros-5',
    name: '00000 (Five Zeros Loop - Length 5)',
    input: '00000',
    expectedValid: true,
    expectedOutput: '000000',
    expectedFinalState: 'q0',
    description: 'Five consecutive zeros staying in q0. Emits 6 zeros (initial 0 + 5 transitions).',
    category: 'standard',
  },
  {
    id: 'tc-ones-5',
    name: '11111 (Five Ones Loop - Length 5)',
    input: '11111',
    expectedValid: true,
    expectedOutput: '011111',
    expectedFinalState: 'q1',
    description: 'Five consecutive ones: advances to q1 and loops 4 times. Emits initial 0 followed by 5 ones.',
    category: 'standard',
  },
  {
    id: 'tc-ones-6',
    name: '111111 (Six Ones Loop - Length 6)',
    input: '111111',
    expectedValid: true,
    expectedOutput: '0111111',
    expectedFinalState: 'q1',
    description: 'Six consecutive ones: produces 7 outputs (0 followed by 6 ones).',
    category: 'standard',
  },
  {
    id: 'tc-long-alt',
    name: '101010101010 (Alternating Long String - Length 12)',
    input: '101010101010',
    expectedValid: true,
    expectedOutput: '0101010101010',
    expectedFinalState: 'q2',
    description: '12-symbol alternating sequence oscillating between q1 and q2. Produces 13 outputs.',
    category: 'standard',
  },
  {
    id: 'tc-zeros-20',
    name: '00000000000000000000 (20 Zeros Loop - Length 20)',
    input: '00000000000000000000',
    expectedValid: true,
    expectedOutput: '000000000000000000000',
    expectedFinalState: 'q0',
    description: '20 consecutive zeros continuously executing self-loop δ(q0, 0) = q0, emitting 21 zeros.',
    category: 'standard',
  },
  {
    id: 'tc-ones-20',
    name: '11111111111111111111 (20 Ones Loop - Length 20)',
    input: '11111111111111111111',
    expectedValid: true,
    expectedOutput: '011111111111111111111',
    expectedFinalState: 'q1',
    description: '20 consecutive ones: advances to q1 and loops 19 times, generating 21 outputs.',
    category: 'standard',
  },
  {
    id: 'tc-inv-digit',
    name: '10201 (Invalid: Contains Digit 2)',
    input: '10201',
    expectedValid: false,
    description: 'Invalid input containing digit 2, violating binary alphabet Σ = {0, 1}.',
    category: 'invalid',
  },
  {
    id: 'tc-inv-alpha',
    name: '10A01 (Invalid: Contains Letter A)',
    input: '10A01',
    expectedValid: false,
    description: 'Contains non-numeric alphabetic character A.',
    category: 'invalid',
  },
  {
    id: 'tc-inv-text',
    name: 'abc (Invalid: Text String)',
    input: 'abc',
    expectedValid: false,
    description: 'Non-binary alphabetic characters.',
    category: 'invalid',
  },
  {
    id: 'tc-inv-mixed',
    name: '12 (Invalid: Mixed Digits)',
    input: '12',
    expectedValid: false,
    description: 'Contains digit 2 outside {0, 1}.',
    category: 'invalid',
  },
  {
    id: 'tc-inv-space',
    name: '1 0 1 (Invalid: Contains Internal Spaces)',
    input: '1 0 1',
    expectedValid: false,
    description: 'Contains space characters, violating binary string syntax.',
    category: 'invalid',
  },
  {
    id: 'tc-inv-empty',
    name: 'Empty String (Length 0)',
    input: '',
    expectedValid: false,
    description: 'Empty input testing validator boundary check.',
    category: 'invalid',
  },
];

/**
 * Safe Synthesized Audio using Web Audio API
 * Plays gentle feedback tones for step changes without external asset dependencies.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playTone(frequency: number = 440, duration: number = 0.08, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio error ignored safely
    }
  }

  public playStep(symbol: string) {
    if (symbol === '0') {
      this.playTone(392.0, 0.07, 'sine'); // G4
    } else if (symbol === '1') {
      this.playTone(523.25, 0.07, 'sine'); // C5
    } else {
      this.playTone(329.63, 0.08, 'sine'); // E4 initial
    }
  }

  public playComplete() {
    this.playTone(659.25, 0.1, 'sine'); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 100); // G5
  }

  public playError() {
    this.playTone(220, 0.15, 'sawtooth');
  }
}

export const sound = new SoundEngine();

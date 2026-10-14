export type StateId = 'q0' | 'q1' | 'q2';
export type BinarySymbol = '0' | '1';

export interface StateDefinition {
  id: StateId;
  name: string;
  output: BinarySymbol;
  description: string;
  isInitial: boolean;
}

export interface TransitionRule {
  fromState: StateId;
  input: BinarySymbol;
  toState: StateId;
}

export interface SimulationStep {
  step: number;
  inputSymbol: string; // '-' for initial step 0, or '0' | '1'
  currentState: StateId;
  nextState: string; // '-' for initial step 0, or StateId
  outputSymbol: BinarySymbol;
  description: string;
  activeTransitionKey?: string; // e.g. "q0-1->q1"
}

export interface SimulationResult {
  inputString: string;
  isValid: boolean;
  errorMessage?: string;
  initialState: StateId;
  initialStateOutput: BinarySymbol;
  stateSequence: StateId[];
  stateSequenceLength: number;
  symbolProcessedOutputSequence: string; // Length N: emitted after reading each input symbol
  outputSequence: string; // Length N + 1: complete Moore output including initial state output
  outputSequenceLength: number;
  finalState: StateId;
  inputLength: number;
  transitionsCount: number;
  statesVisitedCount: number;
  uniqueStatesUsed: StateId[]; // Dynamically calculated subset of {q0, q1, q2}
  uniqueStatesCount: number; // <= 3
  steps: SimulationStep[];
  timestamp: number;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedValid: boolean;
  expectedOutput?: string;
  expectedFinalState?: StateId;
  description: string;
  category: 'standard' | 'edge-case' | 'invalid';
}

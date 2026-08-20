export type BlockCategory =
  | 'motion'
  | 'looks'
  | 'sound'
  | 'events'
  | 'control'
  | 'sensing'
  | 'operators'
  | 'variables';

export type BlockShape = 'hat' | 'stack' | 'c-block' | 'reporter' | 'boolean' | 'cap';

export interface ScratchBlockDef {
  id: string;
  category: BlockCategory;
  shape: BlockShape;
  label: string; // e.g. "al presionar bandera verde", "mover (10) pasos", "por siempre", "si <...> entonces"
  inputs?: { [key: string]: string | number | boolean };
  children?: ScratchBlockDef[]; // for C-blocks (e.g. inside "por siempre" or "si ... entonces")
}

export interface SpriteState {
  id: string;
  name: string;
  avatar: string; // emoji or icon representation
  x: number;
  y: number;
  direction: number;
  rotationStyle: 'all-around' | 'left-right' | 'dont-rotate';
  costume: string;
  blocks: ScratchBlockDef[];
}

export interface ProjectVariable {
  name: string;
  value: number | string;
  initialValue: number | string;
}

export interface DetectedIssue {
  id: string;
  severity: 'error' | 'warning' | 'tip';
  title: string;
  description: string;
  socraticClue: string;
  suggestedCategory: BlockCategory;
  suggestedBlock: string;
}

export interface ProjectState {
  activeSpriteId: string;
  sprites: SpriteState[];
  variables: ProjectVariable[];
  detectedIssues: DetectedIssue[];
}

export interface SocraticStep {
  level: 1 | 2 | 3;
  title: string;
  hint: string;
  suggestedCategory?: BlockCategory;
  suggestedBlocks?: ScratchBlockDef[];
}

export interface DecisionOption {
  id: string;
  text: string;
  icon?: string;
  nextNodeId: string;
  badge?: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  mascotMood: 'happy' | 'thinking' | 'detective' | 'celebrating' | 'explaining';
  explanation?: string;
  clues?: SocraticStep[];
  options: DecisionOption[];
  relatedBlocks?: ScratchBlockDef[];
  autoAnalyze?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  timestamp: string;
  text: string;
  mascotMood?: 'happy' | 'thinking' | 'detective' | 'celebrating' | 'explaining';
  capturedStateSnapshot?: {
    spriteName: string;
    blockCount: number;
    variables: string[];
    issueCount: number;
  };
  clues?: SocraticStep[];
  interactiveOptions?: DecisionOption[];
  blocks?: ScratchBlockDef[];
  isAnalysisReport?: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  category: 'errores' | 'movimiento' | 'puntuacion' | 'juego';
  icon: string;
  description: string;
  spriteName: string;
  spriteAvatar: string;
  blocks: ScratchBlockDef[];
  variables: ProjectVariable[];
  initialNodeId: string;
}

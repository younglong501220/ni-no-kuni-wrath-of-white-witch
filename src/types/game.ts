export type GameTab = 'story' | 'battle' | 'grimoire' | 'familiars';

export interface PlayerStats {
  name: string;
  title: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  exp: number;
  nextExp: number;
  wand: string;
  equippedFamiliarId: string;
}

export type HeartType = 'kindness' | 'courage' | 'enthusiasm' | 'belief';

export interface HeartPiece {
  id: HeartType;
  name: string;
  english: string;
  color: string;
  glowColor: string;
  count: number;
  description: string;
  source: string;
}

export interface Familiar {
  id: string;
  name: string;
  title: string;
  species: string;
  element: 'physical' | 'fire' | 'water' | 'wood' | 'light' | 'dark';
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  matk: number;
  mdef: number;
  image: string;
  favoriteFood: string;
  affinity: number; // 0 - 100
  skills: FamiliarSkill[];
  description: string;
}

export interface FamiliarSkill {
  id: string;
  name: string;
  type: 'attack' | 'buff' | 'special';
  costMp: number;
  power: number;
  description: string;
}

export interface MagicSpell {
  id: string;
  name: string;
  japanese: string;
  costMp: number;
  element: 'fire' | 'water' | 'heal' | 'utility' | 'light';
  description: string;
  runeName: string;
}

export interface Enemy {
  id: string;
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  requiredHeart: HeartType;
  heartMissingDesc: string;
  mendThreshold: number; // HP under which can be mended
  image: string;
  specialMoveName: string;
  expReward: number;
}

export interface StoryChoice {
  text: string;
  actionId: string;
  leadToNodeId: string;
  effect?: {
    hpChange?: number;
    mpChange?: number;
    gainItem?: string;
    gainHeart?: HeartType;
    triggerBattle?: string;
  };
}

export interface StoryNode {
  id: string;
  chapter: string;
  location: string;
  narrative: string[];
  drippyQuote?: string;
  choices: StoryChoice[];
  unlockedSpells?: string[];
  battleEncounterId?: string;
}

export interface CombatLog {
  id: string;
  sender: 'player' | 'familiar' | 'enemy' | 'drippy' | 'system';
  message: string;
  type?: 'damage' | 'heal' | 'glint' | 'victory' | 'warning';
}

export interface GleamOrb {
  id: string;
  type: 'hp' | 'mp' | 'gold';
  x: number; // percentage
  y: number;
}

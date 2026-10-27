export type PlayerRole = 'host' | 'guest';
export type PlayerId = 1 | 2;

export interface Player {
  id: PlayerId;
  name: string;
  avatar: string; // Emoji avatar e.g. 🐱 or 🐰 or 👦 or 👧
  color: string;  // Hex or Tailwind class
  position: number; // 0 to 19
  score: number;   // Completed challenges count
}

export type TileType = 
  | 'start' 
  | 'challenge' 
  | 'chance' 
  | 'safe' 
  | 'jail' 
  | 'skull' 
  | 'roll_again' 
  | 'move_forward' 
  | 'move_backward';

export interface BoardTile {
  id: number;
  title: string;
  subtitle?: string;
  type: TileType;
  iconName: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  badge?: string;
  description: string;
  actionValue?: number; // e.g. +2 for move forward 2, -2 for move backward 2
  gridRow: number;
  gridCol: number;
}

export interface ChanceCard {
  id: number;
  category: 'Deep Talk' | 'Tantangan Romantis' | 'Kocak & Gemas' | 'Spill Rahasia';
  title: string;
  question: string;
  instruction: string;
  tag: string;
}

export interface PeerMessage {
  type: 
    | 'SYNC_STATE'
    | 'ROLL_DICE'
    | 'MOVE_PAWN'
    | 'SHOW_CHALLENGE'
    | 'COMPLETE_CHALLENGE'
    | 'DRAW_CHANCE'
    | 'SEND_REACTION'
    | 'SEND_CHAT'
    | 'UPDATE_PROFILE'
    | 'RESTART_GAME'
    | 'PING'
    | 'PONG';
  payload?: any;
  senderId?: PlayerId;
  timestamp: number;
}

export interface GameState {
  roomCode: string;
  myRole: PlayerRole;
  myPlayerId: PlayerId;
  isConnected: boolean;
  isSingleDeviceMode: boolean; // Pass & play
  partnerConnected: boolean;
  partnerName: string;
  
  turn: PlayerId;
  isRolling: boolean;
  diceValue: number | null;
  players: {
    1: Player;
    2: Player;
  };
  
  currentModal: {
    isOpen: boolean;
    tile?: BoardTile;
    chanceCard?: ChanceCard;
    isChance: boolean;
    canComplete: boolean;
  };

  historyLog: string[];
}
